import React, { useState } from 'react';

// [UI_Vessel_Artel_Palata_Core] + [Artel_Fintech_Tax_Gate] + [UI_Vessel_Gornitsa_Core] + [UI_Chests_View_Core]
// Торговая Артель (Фон 4) и Вечевая Палата (Фон 5) — Интеграция финтех-налога 27% и Боярского Вето
export default function IzbaComponent() {
  // 7 Истинных Балансов Казны
  const [balances] = useState({
    yntPersonal: '1,250.00',
    yntDeposit: '40.00',
    rayLight: '12 / 24',
    pathVeles: 450,
    pathPerun: 120, // Синяя молния ⚡
    pathSvarog: 380,
    vecheLock: 'Взведён'
  });

  const totalGodsRays = balances.pathVeles + balances.pathPerun + balances.pathSvarog;

  // Стейты интерактивного поиска, горниц Терема и финтех-сделки
  const [searchQuery, setSearchText] = useState('');
  const [currentGornitsa, setCurrentGornitsa] = useState<'ALL' | 'BARTER' | 'CENZ' | 'CHRONICLES'>('ALL');
  
  // Финтех-расчёт налога 27% для Артели
  const [dealAmount, setDealAmount] = useState('100'); // Базовый ввод суммы Света/Вещей
  const parsedAmount = parseFloat(dealAmount) || 0;
  const appleTax = Math.round(parsedAmount * 0.27 * 100) / 100; // Метод AppleTax 27%
  const totalWithTax = Math.round((parsedAmount + appleTax) * 100) / 100;

  // Состояния Вечевой Палаты (Фон 5)
  const [vesselAccessLevel, setAccessLevel] = useState<'OPEN' | 'CLOSED'>('OPEN'); // OPEN = Поляна, CLOSED = Закрытая Палата (Терем Бояр)
  const [rebellionPulse, setRebellionPulse] = useState(45); // Шкала недовольства Бояр (%)
  const [boiarSignatures, setBoiarSignatures] = useState([true, false, false]); // Три P2P-слота подписи Бояр

  // Локальная симуляция DoS-нагрузки Скомороха
  const [isDosAttack, setIsDosAttack] = useState(false);

  // Валидированная Матрица Фонов Портала по ТЗ
  const chatDatabase = [
    { id: 1, name: 'Родовая Поляна Чертога', type: 'Главный Экран', chatId: 'chertog_meadow_main', icon: '🌳', unread: 0, status: 'в сети' },
    { id: 2, name: 'Изба (Приватный чат)', type: 'Семейный Круг', chatId: 'izba_private_chat', icon: '🏡', unread: 0, status: 'в сети' },
    { id: 3, name: 'Простой Терем', type: 'Камерное Сообщество', chatId: 'prostoy_terem_community', icon: '🪵', unread: 3, status: 'был в сети 27 мин назад' },
    { id: 4, name: 'Терем-Артель', type: 'Рабочая Мастерская', chatId: 'terem_artel_workshop', icon: '🔨', unread: 0, status: 'кипит световой бартер' },
    { id: 5, name: 'Вечевая Палата', type: 'Локальный Форум', chatId: 'veche_palata_forum', icon: '🏛️', unread: 7, status: 'Бояре на помосте' },
    { id: 6, name: 'Княжеский Двор', type: 'Супер-Сообщество', chatId: 'kniaz_dvor_super_community', icon: '👑', unread: 0, status: 'был в сети вчера' },
    { id: 7, name: 'Глобальное Вече Царства', type: 'Главная Площадь', chatId: 'global_veche_square', icon: '🔔', unread: 42, status: '950 Бояр на помосте' },
    { id: 8, name: 'Торговый Вырий', type: 'Глобальная Ярмарка', chatId: 'torgoviy_vyriy_market', icon: '💎', unread: 1, status: 'P2P-торги открыты' }
  ];

  const [activeChat, setActiveChat] = useState(4); // Торговая Артель активна по умолчанию для теста
  const [inputText, setInputText] = useState('');

  // Расширенная Берестяная Почта под Фоны 4 и 5
  const [mailRepository, setMailRepository] = useState<{ [key: string]: Array<{ id: number; sender: string; text: string; time: string; isMe: boolean; tag: string }> }>({
    'prostoy_terem_community': [
      { id: 301, sender: 'Семейный Хранитель', text: '📜 [Указ] Горница защищена Коном Семейного Хранителя. Вход строго по P2P-инвайтам.', time: '14:20', isMe: false, tag: 'CHRONICLES' },
      { id: 302, sender: 'Брат Радомир', text: '🌾 Обменяю 10 Лучиков Света на 2 Янтаря по курсу Ярмарки. Кому надобно в Горницу Бартера?', time: '14:22', isMe: false, tag: 'BARTER' },
      { id: 303, sender: 'Вы', text: '🛡️ Порог ценза в 27 участников пройден, чужаков в узлах ноды не обнаружено.', time: '14:25', isMe: true, tag: 'CENZ' }
    ],
    'terem_artel_workshop': [
      { id: 401, sender: 'Мастер Ратибор', text: '🔨 Лоза Артели проросла сочно, залог в 40 YNT успешно синхронизирован в блокчейне сети Сварога.', time: '10:15', isMe: false, tag: 'SYSTEM' },
      { id: 402, sender: 'Кузнец Борислав', text: '💼 Выставляю счёт за Оболочку Зеркальца высокого качества. Проверьте плашку финтех-налога.', time: '10:18', isMe: false, tag: 'TRADE' }
    ],
    'veche_palata_forum': [
      { id: 501, sender: 'Дворецкий Места', text: '🗝️ Приветствую, Бояре! Сбор взносов в Пул Игрищ (9 YNT) открыт. Логи Вече очищены.', time: '11:02', isMe: false, tag: 'SYSTEM' },
      { id: 502, sender: 'Боярин Мстислав', text: '⚡ Управляющий нарушает Коны общины! Если Вечевой Пульс Бунта пробьёт порог — задействуем зарок Вепря.', time: '11:05', isMe: false, tag: 'VETO' }
    ]
  });

  const getChatKeyById = (id: number) => {
    if (id === 3) return 'prostoy_terem_community';
    if (id === 4) return 'terem_artel_workshop';
    if (id === 5) return 'veche_palata_forum';
    return 'prostoy_terem_community';
  };

  const currentMessages = mailRepository[getChatKeyById(activeChat)] || [];
  const displayMessages = currentMessages.filter(msg => {
    if (activeChat !== 3) return true;
    if (currentGornitsa === 'ALL') return true;
    return msg.tag === currentGornitsa;
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Вы',
      text: isDosAttack && activeChat === 3 ? 'Ква-ква! 🐸' : inputText,
      time: '19:50',
      isMe: true,
      tag: activeChat === 4 ? 'TRADE' : activeChat === 5 ? 'VETO' : 'CHRONICLES'
    };
    setMailRepository({
      ...mailRepository,
      [getChatKeyById(activeChat)]: [...currentMessages, newMsg]
    });
    setInputText('');
  };

  const filteredChats = chatDatabase.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.chatId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col justify-between font-sans antialiased text-slate-200">
      
      {/* ВЕРХНИЙ СЛОЙ: Тонкая плашка 7 Балансов (max-w-[1152px]) */}
      <div className="w-full max-w-[1152px] mx-auto bg-gradient-to-r from-emerald-800/40 to-slate-800/70 border border-slate-700/40 rounded-xl p-1.5 pr-4 pb-2.5 pt-2.5 mb-4 shadow-xl relative shrink-0">
        <div className="flex flex-row items-center gap-2.5 overflow-x-auto scrollbar-none justify-between w-full">
          <div className="flex items-center gap-2 shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-2.5 py-0.5 rounded-lg">
            <div className="text-center">
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Личный Ларец</span>
              <span className="text-sm font-mono font-medium text-emerald-400">🪞 {balances.yntPersonal}</span>
            </div>
            <div className="w-px h-4 bg-slate-700/60"></div>
            <div className="text-center">
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Ларец Места</span>
              <span className="text-sm font-mono font-medium text-slate-200">🪵 {balances.yntDeposit}</span>
            </div>
          </div>
          <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-2.5 py-0.5 rounded-lg text-center">
            <div>
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Искорки Зари</span>
              <span className="text-sm font-mono font-medium text-cyan-400">🌅 {balances.rayLight}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-3 py-1 rounded-lg min-w-[210px]">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block text-center leading-none mb-1 select-none font-semibold">
              Тропы Богов: <span className="text-sm font-mono text-emerald-300 font-black">{totalGodsRays}</span>
            </div>
            <div className="flex items-center gap-3.5 w-full justify-center">
              <span className="text-sm font-mono font-medium text-amber-500">🌾 {balances.pathVeles}</span>
              <div className="w-px h-3 bg-slate-700/40"></div>
              <span className="text-sm font-mono font-medium text-sky-400">⚡ {balances.pathPerun}</span>
              <div className="w-px h-3 bg-slate-700/40"></div>
              <span className="text-sm font-mono font-medium text-sky-300">☀️ {balances.pathSvarog}</span>
            </div>
          </div>
          <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-2.5 py-0.5 rounded-lg text-center">
            <div>
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Вечевой Залог</span>
              <span className="text-sm font-mono font-medium text-emerald-500">🔒 {balances.vecheLock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ГЛАВНЫЙ ДВУХПАНЕЛЬНЫЙ ДИЗАЙН МЕССЕНДЖЕРА */}
      <div className="flex-1 flex flex-row w-full max-w-[1152px] mx-auto gap-4 items-stretch overflow-hidden h-[calc(100vh-140px)]">
        
        {/* ЛЕВАЯ ПАНЕЛЬ: Список чатов Портала */}
        <div className="w-[320px] shrink-0 bg-[#1e2326]/60 border border-slate-700/40 rounded-2xl p-3 flex flex-col gap-2 overflow-hidden shadow-md">
          <div className="w-full relative shrink-0">
            <input 
              type="text"
              placeholder="🔍 Найти Избу или Терем по ID..."
              value={searchQuery}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-[#161a1d]/80 border border-slate-700/40 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-200 placeholder-neutral-500 focus:outline-none font-mono"
            />
          </div>

          {/* УРОВЕНЬ II ТЕРЕМА (Фон 3) — Вечевой Набат */}
          {activeChat === 3 && (
            <button
              onClick={() => setCurrentGornitsa('ALL')}
              className={`w-full py-2 px-3 rounded-xl border font-mono font-bold text-center text-xs transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-md
                ${currentGornitsa === 'ALL' ? 'bg-gradient-to-r from-amber-600/30 to-orange-600/30 border-amber-500/50 text-amber-400 shadow-inner' : 'bg-amber-950/20 border-amber-900/40 text-slate-400'}`}
            >
              📢 Вечевой Набат
            </button>
          )}

          {/* ПОДДЕРЖКА ФОНА 5: Переключатель уровня доступа в Палате для тестирования трансформации */}
          {activeChat === 5 && (
            <div className="w-full p-1.5 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-1 shrink-0 text-center select-none font-mono">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Допуск Управления Палатой</span>
              <button 
                onClick={() => setAccessLevel(vesselAccessLevel === 'OPEN' ? 'CLOSED' : 'OPEN')}
                className={`w-full py-1 rounded-lg text-[10px] border transition-all ${vesselAccessLevel === 'CLOSED' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
              >
                {vesselAccessLevel === 'CLOSED' ? '🔒 Закрытая Палата (Терем)' : '🍃 Открытая Поляна'}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none mt-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => { setActiveChat(chat.id); if(chat.id !== 3) setCurrentGornitsa('ALL'); }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all border text-left cursor-pointer
                  ${activeChat === chat.id 
                    ? 'bg-gradient-to-r from-emerald-950/40 to-slate-800/40 border-emerald-500/30 shadow-inner' 
                    : 'bg-[#161a1d]/40 border-transparent hover:bg-slate-800/20'}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#161a1d] border border-slate-700/50 flex items-center justify-center text-base shrink-0 shadow-sm">
                    {chat.icon}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">{chat.name}</h4>
                    <span className="text-[9px] font-mono text-neutral-500 block truncate mt-0.5">ID: {chat.chatId}</span>
                  </div>
                </div>
                {chat.unread > 0 && (
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-emerald-600 text-white rounded-full shrink-0 shadow-sm">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: Окно активной переписки и динамических финтех-локаций */}
        <div className={`flex-1 border border-slate-700/40 rounded-2xl flex flex-col overflow-hidden shadow-xl relative transition-all duration-500
          ${activeChat === 5 && vesselAccessLevel === 'CLOSED' ? 'bg-[#221e1a]/80 border-amber-900/40' : 'bg-[#1e2326]/60'}`}>
          
          {/* Шапка чата */}
          <div className="p-3 border-b border-slate-700/40 bg-black/10 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#161a1d] border border-slate-700/50 flex items-center justify-center text-sm shadow-sm">
                {chatDatabase[activeChat - 1].icon}
              </div>
              <div className="leading-tight">
                <h3 className="text-xs font-semibold text-slate-200">
                  {activeChat === 5 && vesselAccessLevel === 'CLOSED' ? 'Парадный Вечевой Терем (Палата)' : chatDatabase[activeChat - 1].name}
                </h3>
                <span className="text-[10px] font-mono font-medium text-emerald-400 block mt-0.5 animate-pulse">
                  ● {chatDatabase[activeChat - 1].status}
                </span>
              </div>
            </div>

            {/* ИИ-АГЕНТЫ И СТАЗИС КОНТУРЫ (Фон 3 = Скоморох, Фон 5 = Дворецкий Места) */}
            {activeChat === 3 && (
              <div className="flex items-center gap-2 pr-2">
                <button onClick={() => setIsDosAttack(!isDosAttack)} className={`px-1.5 py-0.5 text-[8px] font-mono border rounded uppercase cursor-pointer ${isDosAttack ? 'bg-red-950 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>{isDosAttack ? '💥 Атака!' : 'Стабильно'}</button>
                <div className="text-xl animate-bounce duration-[4000ms]" title="ИИ-Скоморох 🤪">🤪</div>
              </div>
            )}
            
            {activeChat === 5 && (
              <div className="flex items-center gap-2 pr-2">
                <div className="text-xl animate-bounce duration-[4000ms] cursor-help" title="ИИ-Дворецкий Места со связкой ключей 🕵️‍♂️. Собирает взносы 9 YNT.">🕵️‍♂️</div>
              </div>
            )}

            <span className="text-[9px] font-mono text-neutral-500 px-2 py-0.5 bg-neutral-950/30 rounded-lg">
              id: {chatDatabase[activeChat - 1].chatId}
            </span>
          </div>

          {/* ЛОКАЦИЯ ФОН 4: Органическое прорастание Лозы Артели и Финтех-плашка налога 27% [Artel_Fintech_Tax_Gate] */}
          {activeChat === 4 && (
            <div className="w-full bg-[#161a1d]/60 p-2.5 border-b border-slate-700/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg animate-pulse">🌿</span>
                <div className="leading-tight min-w-0">
                  <span className="text-[10px] text-emerald-400 font-bold block">[Лоза Артели Проросла]</span>
                  <span className="text-[8px] text-neutral-500 truncate block">Световой бартер активен. Залог 40 YNT запечён.</span>
                </div>
              </div>
              
              {/* Финтех-Калькулятор сделки */}
              <div className="flex items-center gap-2 bg-black/40 border border-slate-800 p-1.5 rounded-xl text-[10px] w-full md:max-w-xs justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-1 text-slate-300">
                    <span>Сумма:</span>
                    <input 
                      type="number" 
                      value={dealAmount} 
                      onChange={(e) => setDealAmount(e.target.value)}
                      className="w-12 bg-transparent border-b border-slate-700 text-emerald-400 focus:outline-none text-center font-bold font-mono"
                    />
                  </div>
                  <span className="text-[8px] text-amber-500 font-bold">🍎 Tax 27%: +{appleTax} YNT</span>
                </div>
                <div className="w-px h-6 bg-slate-800"></div>
                <div className="text-right leading-tight">
                  <span className="text-[7.5px] text-neutral-500 block uppercase">Выход в Пул</span>
                  <span className="text-xs font-bold text-slate-200">{totalWithTax} YNT</span>
                </div>
                <button 
                  onClick={() => alert(`CAmount Валидна! Транзакция запечена в ядре: ${totalWithTax} YNT.`)}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[9px] font-bold rounded-lg border border-emerald-600 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  💸 Оплатить
                </button>
              </div>
            </div>
          )}

          {/* ЛОКАЦИЯ ФОН 5: Вечевая Палата и Табло «Вечевой Пульс Бунта» с P2P-Вето Бояр */}
          {activeChat === 5 && vesselAccessLevel === 'CLOSED' && (
            <div className="w-full bg-amber-950/20 p-2.5 border-b border-amber-900/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
              <div className="w-full md:max-w-xs space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-amber-500 uppercase">
                  <span>⚡ Вечевой Пульс Бунта против Управляющего</span>
                  <span>{rebellionPulse}%</span>
                </div>
                <div className="w-full bg-black/40 border border-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-red-600 transition-all duration-500" style={{ width: `${rebellionPulse}%` }}></div>
                </div>
              </div>
              <div className="w-px h-6 bg-amber-900/40 hidden md:block"></div>
              
              {/* Три P2P слота подписи вето Бояр */}
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-neutral-500 uppercase font-bold">Вето Бояр (Зарок Вепря):</span>
                <div className="flex gap-1">
                  {boiarSignatures.map((signed, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const updated = [...boiarSignatures];
                        updated[idx] = !updated[idx];
                        setBoiarSignatures(updated);
                        setRebellionPulse(updated.filter(Boolean).length * 25 + 20);
                      }}
                      className={`w-5 h-5 rounded border text-[8px] font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm
                        ${signed ? 'bg-red-900/40 border-red-500 text-red-400 shadow-inner' : 'bg-slate-900 border-slate-800 text-neutral-600 hover:border-slate-700'}`}
                      title={`Слот P2P подписи №${idx + 1}`}
                    >
                      {signed ? '🔒' : '✍️'}
                    </button>
                  ))}
                </div>
                {rebellionPulse >= 70 && (
                  <span className="text-[8px] font-bold bg-red-900/60 border border-red-500 px-1.5 py-0.5 rounded text-red-400 animate-pulse uppercase">
                    Ключ Блокирован!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* УРОВЕНЬ I ТЕРЕМА (Фон 3) */}
          {activeChat === 3 && (
            <div className="w-full bg-black/10 p-2 border-b border-slate-700/20 flex flex-row items-center gap-3 justify-center shrink-0 overflow-x-auto scrollbar-none select-none">
              <button onClick={() => setCurrentGornitsa('BARTER')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer shadow-sm ${currentGornitsa === 'BARTER' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>🌾 Горница Бартера</button>
              <button onClick={() => setCurrentGornitsa('CENZ')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer shadow-sm ${currentGornitsa === 'CENZ' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>🛡️ Горница Ценза</button>
              <button onClick={() => setCurrentGornitsa('CHRONICLES')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer shadow-sm ${currentGornitsa === 'CHRONICLES' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>📜 Горница Летописей</button>
            </div>
          )}

          {/* Зона летящих сообщений чата */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none flex flex-col justify-end bg-black/5">
            {displayMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[70%] leading-snug animate-fadeIn ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                {!msg.isMe && (
                  <span className="text-[9px] font-semibold text-emerald-400 mb-0.5 ml-1 font-mono">
                    {msg.sender} {activeChat === 3 && `[${msg.tag}]`}
                  </span>
                )}
                <div className={`p-2.5 rounded-2xl border text-xs shadow-md break-words relative ${msg.tag === 'SYSTEM' ? 'border-amber-400 bg-amber-950/20 text-amber-200' : ''} ${msg.tag !== 'SYSTEM' && msg.isMe ? 'bg-gradient-to-r from-emerald-900/50 to-emerald-950/50 border-emerald-800/30 text-slate-100 rounded-br-sm' : msg.tag !== 'SYSTEM' ? 'bg-[#161a1d]/80 border-slate-800/60 text-slate-200 rounded-bl-sm' : ''}`}>
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[8px] font-mono text-neutral-500 leading-none">
                    <span>{msg.time}</span>
                    {msg.isMe && <span className="text-emerald-400 font-bold tracking-tighter">✓✓</span>}
                  </div>
                </div>
              </div>
            ))}
            {displayMessages.length === 0 && (
              <div className="text-center text-[11px] text-neutral-600 font-mono py-12 italic select-none">Берестяная Почта пуста... 📜</div>
            )}
          </div>

          {/* Поле ввода текста на бересте */}
          <div className="p-3 border-t border-slate-700/40 bg-black/10 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Напишите думу на бересте..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-[#161a1d]/60 border border-slate-700/40 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-neutral-500 focus:outline-none font-mono"
            />
            <button onClick={handleSendMessage} className="px-4 py-2.5 bg-[#047857]/90 text-slate-200 border border-emerald-800/30 font-semibold rounded-xl text-xs hover:bg-[#065f46] hover:text-white transition-all active:scale-95 shadow-md cursor-pointer">
              Отправить
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}