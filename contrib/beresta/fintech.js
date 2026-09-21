'use strict';
// ============================================================================
// Контур II-III: Наливной Налог [Apple_Tax_Circulation_Logic]
//                Казначейство Игрищ [Game_Payout_Distribution_Logic]
// ============================================================================

// ---- Константы (для отображения; расчёт ведётся в целых числах) -------------
const APPLE_TAX = 0.27;      // 27% налога на P2P-переводы Лучиков между Лавками
const WINNER_SHARE = 0.72;   // 72% победителю
const VAULT_SHARE = 0.13;    // 13% в Казну Палаты
const BURN_SHARE = 0.15;     // 15% принудительное сжигание (Lada_Burn)

// Целые проценты - именно они участвуют в расчётах
const TAX_PCT = 27n, WINNER_PCT = 72n, VAULT_PCT = 13n, BURN_PCT = 15n;

// Защита от расхождения между double-константами и целыми процентами
if (Math.round(APPLE_TAX * 100) !== Number(TAX_PCT) ||
    Math.round(WINNER_SHARE * 100) !== Number(WINNER_PCT) ||
    Math.round(VAULT_SHARE * 100) !== Number(VAULT_PCT) ||
    Math.round(BURN_SHARE * 100) !== Number(BURN_PCT) ||
    WINNER_PCT + VAULT_PCT + BURN_PCT !== 100n) {
  throw new Error('Константы долей не согласованы: сумма должна быть ровно 100%');
}

// ---- Конфигурация (подставить реальные значения) ----------------------------
const CFG = {
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:37070',
  rpcUser: process.env.RPC_USER || '',
  rpcPass: process.env.RPC_PASS || '',
  globalLightPool: 'ЗАМЕНИТЬ_Global_Light_Pool_ADDRESS', // системный адрес пула Росы
  burnAddress: 'ЗАМЕНИТЬ_UNSPENDABLE_BURN_ADDRESS',       // нетратимый адрес сжигания
  decimals: 8,
};
const UNIT = 10n ** BigInt(CFG.decimals);

// ---- Вспомогательные функции ------------------------------------------------
/** Единицы (BigInt) -> строка с 8 знаками для RPC, без float. */
function toCoins(units) {
  const whole = units / UNIT;
  const frac = (units % UNIT).toString().padStart(CFG.decimals, '0');
  return `${whole}.${frac}`;
}

/** Десятичная строка/число -> единицы (BigInt), без float. */
function toUnits(str) {
  const [w, f = ''] = String(str).split('.');
  return BigInt(w) * UNIT + BigInt((f + '0'.repeat(CFG.decimals)).slice(0, CFG.decimals));
}

async function rpc(method, params = []) {
  const res = await fetch(CFG.rpcUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Basic ' + Buffer.from(`${CFG.rpcUser}:${CFG.rpcPass}`).toString('base64'),
    },
    body: JSON.stringify({ jsonrpc: '1.0', id: 'beresta', method, params }),
  });
  const j = await res.json();
  if (j.error) throw new Error(`${method}: ${j.error.message}`);
  return j.result;
}

// ---- ХУКИ: реализовать поверх PocketDb / ваших RPC ---------------------------
/** true, если адрес принадлежит Местной Лавке (Фон 4). Состояние на высоте проверки. */
async function hookIsLocalShop(addr) { throw new Error('hookIsLocalShop: не реализован'); }

// ---- Наливной Налог ---------------------------------------------------------
/**
 * Делит сумму перевода: 27% в Global_Light_Pool, остальное получателю.
 * Округление вниз; перевод, при котором налог округляется до 0, отклоняется
 * (иначе налог обходится дроблением на мелкие переводы).
 */
function splitAppleTax(amountUnits) {
  if (amountUnits <= 0n) throw new Error('Сумма должна быть положительной');
  const tax = (amountUnits * TAX_PCT) / 100n;
  if (tax === 0n) throw new Error('Сумма слишком мала: налог округляется до нуля');
  return { tax, net: amountUnits - tax };
}

/**
 * RPC-обработчик lighttransfer (тип P2P_Transfer): from, to, amount (в Лучиках, строка).
 * Собирает транзакцию с двумя выходами: получателю и в пул. Подписывает и отправляет.
 */
async function lightTransfer(from, to, amountStr) {
  if (!(await hookIsLocalShop(from)) || !(await hookIsLocalShop(to))) {
    throw new Error('Наливной Налог действует только между Местными Лавками');
  }
  const { tax, net } = splitAppleTax(toUnits(amountStr));

  const outputs = [{ [to]: toCoins(net) }, { [CFG.globalLightPool]: toCoins(tax) }];
  const raw = await rpc('createrawtransaction', [[], outputs]);
  const funded = await rpc('fundrawtransaction', [raw, { changeAddress: from }]);
  const signed = await rpc('signrawtransactionwithwallet', [funded.hex]);
  if (!signed.complete) throw new Error('Транзакция не подписана полностью');
  return rpc('sendrawtransaction', [signed.hex]);
}

/**
 * Проверка для индексатора/ноды: заплачен ли налог. decoded - результат decoderawtransaction.
 * Тот же алгоритм обязан быть в C++ консенсусе.
 */
function verifyAppleTax(decoded, recipientAddr) {
  let toRecipient = 0n, toPool = 0n;
  for (const o of decoded.vout) {
    const addrs = (o.scriptPubKey && o.scriptPubKey.addresses) || [];
    const v = toUnits(o.value);
    if (addrs.includes(recipientAddr)) toRecipient += v;
    if (addrs.includes(CFG.globalLightPool)) toPool += v;
  }
  const total = toRecipient + toPool;
  return toPool >= (total * TAX_PCT) / 100n && toPool > 0n;
}

// ---- Казначейство Игрищ -----------------------------------------------------
/**
 * Раскладка Пула Янтаря по итогам голосования.
 * Остаток от целочисленного деления уходит в Казну Палаты, поэтому сумма всегда точна.
 */
function splitGamePot(potUnits) {
  if (potUnits <= 0n) throw new Error('Пул пуст');
  const winner = (potUnits * WINNER_PCT) / 100n;
  const burn = (potUnits * BURN_PCT) / 100n;
  const vault = potUnits - winner - burn; // 13% + остаток округления
  if (winner + vault + burn !== potUnits) throw new Error('Нарушен баланс раскладки');
  return { winner, vault, burn };
}

/**
 * RPC-обработчик gamepayout: winnerAddr, pot (в YNT, строка), vaultAddr.
 * ВАЖНО: winnerAddr должен определяться подсчётом голосов на уровне цепочки,
 * а не приходить от вызывающего. Здесь принимается как уже подтверждённый.
 */
async function gamePayout(winnerAddr, potStr, vaultAddr) {
  const { winner, vault, burn } = splitGamePot(toUnits(potStr));
  const outputs = [
    { [winnerAddr]: toCoins(winner) },
    { [vaultAddr]: toCoins(vault) },
    { [CFG.burnAddress]: toCoins(burn) },
  ];
  const raw = await rpc('createrawtransaction', [[], outputs]);
  const funded = await rpc('fundrawtransaction', [raw, { changeAddress: vaultAddr }]);
  const signed = await rpc('signrawtransactionwithwallet', [funded.hex]);
  if (!signed.complete) throw new Error('Транзакция не подписана полностью');
  return rpc('sendrawtransaction', [signed.hex]);
}

module.exports = { APPLE_TAX, WINNER_SHARE, VAULT_SHARE, BURN_SHARE,
  splitAppleTax, lightTransfer, verifyAppleTax, splitGamePot, gamePayout };