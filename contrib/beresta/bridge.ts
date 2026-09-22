import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import crypto from 'crypto';
import fetch from 'node-fetch';

// ============================================================================
// Мост "Синяя Береста" <-> Telegram
// Node.js 18+, TypeScript, telegraf
// ============================================================================

// ---- Конфигурация (значения брать из окружения, .env в репозиторий не класть) ----
const CFG = {
  botToken: mustEnv('TELEGRAM_BOT_TOKEN'),
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8028', // закрытый RPC-порт узла
  rpcUser: mustEnv('RPC_USER'),
  rpcPass: mustEnv('RPC_PASS'),
  // Адрес кошелька узла, с которого оплачивается якорение сообщений в блокчейн.
  // Приватный ключ этого адреса живёт ТОЛЬКО в кошельке ноды (Pocketcoin Core),
  // в код моста он никогда не попадает.
  anchorFromAddress: mustEnv('ANCHOR_FROM_ADDRESS'),
  authMaxAgeSeconds: Number(process.env.TG_AUTH_MAX_AGE_SEC || 86400), // окно жизни auth_date
};

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Не задана переменная окружения ${name}`);
  return v;
}

// ============================================================================
// JSON-RPC клиент к ноде "Синяя Береста" (порт 8028)
// ============================================================================

interface JsonRpcError { code: number; message: string; }
interface JsonRpcResponse<T> { result: T; error: JsonRpcError | null; id: string; }

/**
 * Вызов JSON-RPC 1.0 метода. Авторизация Basic — как принято в Bitcoin/Dash-форках.
 * Бросает исключение с текстом ошибки ноды, если error != null.
 */
async function rpcCall<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch(CFG.rpcUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Basic ' + Buffer.from(`${CFG.rpcUser}:${CFG.rpcPass}`).toString('base64'),
    },
    body: JSON.stringify({ jsonrpc: '1.0', id: 'tg-bridge', method, params }),
  });

  if (!res.ok) {
    throw new Error(`RPC HTTP ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as JsonRpcResponse<T>;
  if (json.error) {
    throw new Error(`RPC ${method}: ${json.error.message} (code ${json.error.code})`);
  }
  return json.result;
}

// ============================================================================
// Шлюзование сообщений чата в блокчейн
// ============================================================================

/**
 * Упаковывает произвольный текст в OP_RETURN и отправляет через sendrawtransaction.
 *
 * ВАЖНО: sendrawtransaction принимает готовую ПОДПИСАННУЮ raw-транзакцию, а не
 * произвольный текст напрямую. Поэтому мост:
 *   1. createrawtransaction — собирает транзакцию с нулевым OP_RETURN-выходом,
 *      несущим текст сообщения;
 *   2. fundrawtransaction   — нода сама подбирает входы и адрес сдачи из
 *      кошелька ANCHOR_FROM_ADDRESS;
 *   3. signrawtransactionwithwallet — подпись происходит ВНУТРИ ноды, приватный
 *      ключ моста никогда не покидает кошелёк и не хранится в этом сервисе;
 *   4. sendrawtransaction   — рассылка в сеть.
 *
 * Если нода недоступна или кошелёк не хочет подписывать (например, залочен),
 * функция бросает исключение — вызывающий код должен сообщить об этом в чат,
 * а не сделать вид, что сообщение записано.
 */
async function anchorMessageOnChain(text: string, fromChatId: number, fromUserId: number): Promise<string> {
    // Ограничиваем длину полезной нагрузки, чтобы не упереться в лимиты
    // OP_RETURN/datacarrier и не раздувать блок одним сообщением.
    const MAX_PAYLOAD_BYTES = 200;
    const payload = JSON.stringify({ chat: fromChatId, user: fromUserId, text }).slice(0, MAX_PAYLOAD_BYTES);
    const payloadHex = Buffer.from(payload, 'utf8').toString('hex');

    const opReturnScript = { data: payloadHex }; // формат outputs для createrawtransaction

    const rawHex = await rpcCall<string>('createrawtransaction', [[], [opReturnScript]]);

    const funded = await rpcCall<{ hex: string; fee: number; changepos: number }>('fundrawtransaction', [
        rawHex,
        { changeAddress: CFG.anchorFromAddress },
    ]);

    const signed = await rpcCall<{ hex: string; complete: boolean }>('signrawtransactionwithwallet', [funded.hex]);
    if (!signed.complete) {
        throw new Error('Нода не смогла полностью подписать транзакцию (кошелёк залочен?)');
    }

    const txid = await rpcCall<string>('sendrawtransaction', [signed.hex]);
    return txid;
}

// ============================================================================
// Синхронизация ИИ-Агентов: /getaistatus
// ============================================================================

/** Ответ C++ RPC-метода getaistatus (см. server.cpp / GetAiStatusRpc). */
interface AiStatusResult {
  wolf_antispam: boolean;
  leshy_quest: boolean;
}

const AI_AGENT_LABELS: Record<keyof AiStatusResult, string> = {
  wolf_antispam: 'Серый Волк (защита от спама)',
  leshy_quest: 'Леший (движок квестов)',
};

/** Разбирает UniValue-ответ ноды и формирует человекочитаемый отчёт на русском. */
function formatAiStatus(status: AiStatusResult): string {
  const lines = (Object.keys(AI_AGENT_LABELS) as (keyof AiStatusResult)[]).map((key) => {
    const ready = status[key];
    const icon = ready ? '🟢' : '🔴';
    const state = ready ? 'на посту, готов к работе' : 'не поднят (нет весов или мало видеопамяти)';
    return `${icon} ${AI_AGENT_LABELS[key]}: ${state}`;
  });
  return ['*Состояние ИИ-Агентов Синей Бересты:*', '', ...lines].join('\n');
}

// ============================================================================
// [Telegram_Auth_Bridge]: проверка Auth-Data Telegram WebApp
// ============================================================================

/**
 * Валидация initData, которую Telegram WebApp передаёт при запуске.
 * Алгоритм строго по документации Telegram (HMAC-SHA256), НЕ Ed25519 —
 * приватных ключей Ed25519 на сервере бота нет и быть не должно.
 *
 * Схема:
 *   secretKey       = HMAC_SHA256(botToken, key = "WebAppData")
 *   dataCheckString = отсортированные по алфавиту "key=value" через '\n',
 *                     без самого поля hash
 *   computedHash    = HMAC_SHA256(dataCheckString, key = secretKey), hex
 * Успех только при точном (constant-time) совпадении computedHash и
 * присланного hash, и если auth_date не протух.
 *
 * Возвращает распарсенные поля при успехе, либо null — тогда пользователя
 * дальше тумана на Поляну пускать нельзя.
 */
function verifyTelegramWebAppAuth(initData: string): Record<string, string> | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(CFG.botToken).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  // Сравнение постоянного времени — защита от timing-атак на строку хэша
  const a = Buffer.from(computedHash, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  const authDate = Number(params.get('auth_date') || '0');
  const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
  if (!authDate || ageSeconds > CFG.authMaxAgeSeconds || ageSeconds < 0) {
    return null; // сессия протухла или дата из будущего — подозрительно
  }

  return Object.fromEntries(params.entries());
}

/**
 * Заглушка проверки входа в WebApp. Реальный HTTP-хендлер (Express/Fastify)
 * должен вызывать эту функцию перед выдачей любых прав доступа к Поляне.
 */
function gateToPolyana(initData: string): { allowed: boolean; reason?: string; user?: Record<string, string> } {
  const parsed = verifyTelegramWebAppAuth(initData);
  if (!parsed) {
    return { allowed: false, reason: 'Хэш Auth-Data не сошёлся или сессия протухла — туман не расступается' };
  }
  return { allowed: true, user: parsed };
}

// ============================================================================
// Бот telegraf: маршрутизация сообщений и команд
// ============================================================================

const bot = new Telegraf(CFG.botToken);

// Команда синхронизации ИИ-агентов
bot.command('getaistatus', async (ctx: Context) => {
  try {
    const status = await rpcCall<AiStatusResult>('getaistatus');
    await ctx.reply(formatAiStatus(status), { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.reply(`Не удалось получить статус агентов: ${(err as Error).message}`);
  }
});

// Все прочие текстовые сообщения — шлюзуются в блокчейн через sendrawtransaction
bot.on(message('text'), async (ctx: Context) => {
  const text = (ctx.message as { text: string }).text;
  if (text.startsWith('/')) return; // неизвестные команды сюда не якорим

  const chatId = ctx.chat!.id;
  const userId = ctx.from!.id;

  try {
    const txid = await anchorMessageOnChain(text, chatId, userId);
    await ctx.reply(`Сообщение зашито в блок. txid: \`${txid}\``, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.reply(`Не удалось записать сообщение в цепь: ${(err as Error).message}`);
  }
});

// ---- Обработка ошибок и корректное завершение ----
bot.catch((err, ctx) => {
  console.error(`Ошибка обработки апдейта ${ctx.updateType}:`, err);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch().then(() => {
  console.log('Мост "Синяя Береста" <-> Telegram запущен');
});

// Экспорт для HTTP-слоя WebApp-логина (Express/Fastify подключается отдельно)
export { gateToPolyana, verifyTelegramWebAppAuth, rpcCall, anchorMessageOnChain };