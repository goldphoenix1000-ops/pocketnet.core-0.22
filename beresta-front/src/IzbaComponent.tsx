import React, { useState, useEffect } from 'react';

// [UI_Vessel_World_Veche_Core] + [UI_Vessel_Knyaz_Dvor_Core] + [UI_Vessel_Zabavy_Core] + [UI_Vessel_Artel_Palata_Core] + [UI_Chests_View_Core]
// Глобальный Блокчейн-Парламент (Фон 7) — Мировое Вече с калькулятором веса голосов Veche_Vote_Weight_Engine
export default function IzbaComponent() {
  // 7 Истинных Балансов Казны
  const [balances, setBalances] = useState({
    yntPersonal: 1241.00,
    yntDeposit: 40.00,
    rayLight: '12 / 24',
    pathVeles: 450,
    pathPerun: 120, // Синяя молния ⚡
    pathSvarog: 380,
    vecheLock: 'Взведён'
  });

  const totalGodsRays = balances.pathVeles + balances.pathPerun + balances.pathSvarog;

  // Базовые стейты поиска, горниц Терема, финтех-сделок, Игрищ и Княжеского Двора
  const [searchQuery, setSearchText] = useState('');
  const [currentGornitsa, setCurrentGornitsa] = useState<'ALL' | 'BARTER' | 'CENZ' | 'CHRONICLES'>('ALL');
  const [dealAmount, setDealAmount] = useState('100');
  const [vesselAccessLevel, setAccessLevel] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [rebellionPulse, setRebellionPulse] = useState(45);
  const [boiarSignatures, setBoiarSignatures] = useState([true, false, false]);

  const [gamePhase, setGamePhase] = useState<'CROWDFUNDING' | 'VOTE' | 'TRIUMPH'>('CROWDFUNDING');
  const [prizePool, setPrizerPool] = useState(117);
  const [userChin, setUserChin] = useState<'БОЯРИН' | 'КУДЕСНИК' | 'ПРОХОЖИЙ'>('БОЯРИН');
  const [isUserInGame, setIsUserInGame] = useState(false);
  const [triumphTriggered, setTriumphTriggered] = useState(false);
  const [nominees, setNominees] = useState([
    { id: 1, name: 'Боярин Добрыня', votes: 120, isWinner: false, glow: false },
    { id: 2, name: 'Кудесник Ратибор', votes: 145, isWinner: false, glow: false },
    { id: 3, name: 'Боярин Мстислав', votes: 95, isWinner: false, glow: false }
  ]);

  const [isBlizzardActive, setIsBlizzardActive] = useState(false);
  const [selectedBoiarBuilding, setSelectedBoiarBuilding] = useState<number | null>(null);
  const [boiarEstates, setBoiarBuilding] = useState([
    { id: 1, name: 'Личная Изба Добрыни', owner: 'Добрыня', shape: 'SQUARE', icon: '🏡', activeLock: false, hasDeposit: true },
    { id: 2, name: 'Терем Камерный Радомира', owner: 'Радомир', shape: 'CIRCLE', icon: '🪵', activeLock: false, hasDeposit: true },
    { id: 3, name: 'Кузница-Артель Борислава', owner: 'Борислав', shape: 'SQUARE', icon: '🔨', activeLock: true, hasDeposit: true },
    { id: 4, name: 'Заброшенная Нода Мстислава', owner: 'Мстислав', shape: 'SQUARE', icon: '🪵', activeLock: false, hasDeposit: false }
  ]);

  // ================= ФОН 7: СУВЕРЕННЫЕ СТЕЙТЫ МИРОВОГО ВЕЧЕ =================
  const [vecheChin, setVecheChin] = useState<'ПРОХОЖИЙ' | 'БОЯРИН' | 'КУДЕСНИК'>('БОЯРИН');
  const [isArchitectModifier, setIsArchitectModifier] = useState(false); // Множитель Зодчего Вырия x2.0 поверх Чина
  
  // Карточки Мировых Вопросов (Предложения по изменению Кона)
  const [vecheProposals, setVecheProposals] = useState([
    { id: 1, title: 'Апдейт C++ кода ядра ноды: Ограничение APPLE_TAX до 24%', quorum: 68, votesLubor: 450, votesNelubor: 120, isVetoActive: false },
    { id: 2, title: 'Распределение Общемирового Светового Котла в Пул Валидаторов', quorum: 42, votesLubor: 210, votesNelubor: 190, isVetoActive: false }
  ]);

  // Локальная симуляция DoS-нагрузки Скомороха
  const [isDosAttack, setIsDosAttack] = useState(false);

  // Валидированная Матрица Фонов Портала по ТЗ (Добавлен Фон 7)
  const chatDatabase = [
    { id: 1, name: 'Родовая Поляна Чертога', type: 'Главный Экран', chatId: 'chertog_meadow_main', icon: '🌳', unread: 0, status: 'в сети' },
    { id: 2, name: 'Изба (Приватный чат)', type: 'Семейный Круг', chatId: 'izba_private_chat', icon: '🏡', unread: 0, status: 'в сети' },
    { id: 3, name: 'Простой Терем', type: 'Камерное Сообщество', chatId: 'prostoy_terem_community', icon: '🪵', unread: 3, status: 'был в сети 27 мин назад' },
    { id: 4, name: 'Терем-Артель', type: 'Рабочая Мастерская', chatId: 'terem_artel_workshop', icon: '🔨', unread: 0, status: 'кипит световой бартер' },
    { id: 5, name: 'Вечевая Палата', type: 'Локальный Форум', chatId: 'veche_palata_forum', icon: '🏛️', unread: 7, status: 'Бояре на помосте' },
    { id: 6, name: 'Княжеский Двор', type: 'Супер-Сообщество', chatId: 'kniaz_dvor_super_community', icon: '👑', unread: 0, status: 'лазерные межи портов' },
    { id: 7, name: 'Глобальное Вече Царства', type: 'Главная Площадь', chatId: 'global_veche_square', icon: '🔔', unread: 42, status: 'ситуационный хай-тек центр' },
    { id: 9, name: 'Игрища Кудесников', type: 'Палата Игрищ (Фон 9)', chatId: 'igrischa_kudesnik_pool', icon: '⚔️', unread: 1, status: 'Забавы взведены' }
  ];

  const [activeChat, setActiveChat] = useState(7); // Глобальное Вече активно по умолчанию для теста
  const [inputText, setInputText] = useState('');

  // Расширенная Берестяная Почта
  const [mailRepository, setMailRepository] = useState<{ [key: string]: Array<{ id: number; sender: string; text: string; time: string; isMe: boolean; tag: string }> }>({
    'prostoy_terem_community': [{ id: 301, sender: 'Семейный Хранитель', text: '📜 Горница защищена Коном.', time: '14:20', isMe: false, tag: 'CHRONICLES' }],
    'terem_artel_workshop': [{ id: 401, sender: 'Мастер Ратибор', text: '🔨 Лоза Артели проросла сочно.', time: '10:15', isMe: false, tag: 'SYSTEM' }],
    'veche_palata_forum': [{ id: 501, sender: 'Дворецкий Места', text: '🗝️ Сбор взносов в Пул Игрищ открыт.', time: '11:02', isMe: false, tag: 'SYSTEM' }],
    'igrischa_kudesnik_pool': [{ id: 901, sender: 'Емеля на Печи', text: '💤 Забавы взведены ладно.', time: '12:00', isMe: false, tag: 'SYSTEM' }],
    'kniaz_dvor_super_community': [{ id: 601, sender: 'Елена Премудрая', text: '📖 Все лазерные линии связи активны.', time: '16:00', isMe: false, tag: 'SYSTEM' }],
    'global_veche_square': [
      { id: 701, sender: 'Елена Премудрая', text: '📖 [Веды] Открываю Всемирный Сход Глобального Блокчейн-Парламента Синей Бересты. Голографический кворум задействован.', time: '17:00', isMe: false, tag: 'SYSTEM' },
      { id: 702, sender: 'Дворецкий Места', text: '🏛️ На Помосте выставлены новые Свитки Мировых Вопросов. Сила клика Странников пересчитывается движком Veche_Vote_Weight_Engine.', time: '17:05', isMe: false, tag: 'PARLIAMENT' }
    ]
  });

  const getChatKeyById = (id: number) => {
    if (id === 3) return 'prostoy_terem_community';
    if (id === 4) return 'terem_artel_workshop';
    if (id === 5) return 'veche_palata_forum';
    if (id === 6) return 'kniaz_dvor_super_community';
    if (id === 7) return 'global_veche_square';
    if (id === 9) return 'igrischa_kudesnik_pool';
    return 'prostoy_terem_community';
  };

  const currentMessages = mailRepository[getChatKeyById(activeChat)] || [];
  const displayMessages = currentMessages.filter(msg => {
    if (activeChat !== 3) return true;
    if (currentGornitsa === 'ALL') return true;
    return msg.tag === currentGornitsa;
  });

  // Логика Веса Голоса по Чинам [Veche_Vote_Weight_Engine]
  const handleVecheVote = (proposalId: number, type: 'LUBO' | 'NELUBO') => {
    let baseWeight = totalGodsRays; // На основе накопленного вечного Света
    const chinMultiplier = vecheChin === 'БОЯРИН' ? 1.5 : vecheChin === 'КУДЕСНИК' ? 2.0 : 1.0;
    let finalWeight = Math.floor(baseWeight * chinMultiplier);
    
    if (isArchitectModifier) {
      finalWeight = Math.floor(finalWeight * 2.0); // Накладывается поверх Чина
    }

    setVecheProposals(prev => prev.map(prop => {
      if (prop.id === proposalId) {
        if (type === 'LUBO') {
          return { ...prop, votesLubor: prop.votesLubor + finalWeight, quorum: Math.min(prop.quorum + 2, 100) };
        } else {
          // Если вето Нелюбо — активируется триггер Зарока Вепря
          return { ...prop, votesNelubor: prop.votesNelubor + finalWeight, isVetoActive: true };
        }
      }
      return prop;
    }));
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Вы',
      text: inputText,
      time: '17:10',
      isMe: true,
      tag: 'PARLIAMENT_CHAT'
    };
    setMailRepository({
      ...mailRepository,
      [getChatKeyById(activeChat)]: [...currentMessages, newMsg]
    });
    setInputText('');
  };

  const handleToggleBuildingLock = (id: number) => {
    setBoiarBuilding(prev => prev.map(b => b.id === id ? { ...b, activeLock: !b.activeLock } : b));
  };

  const handleJoinGame = () => { if (!isUserInGame) { setIsUserInGame(true); setPrizerPool(p => p + 9); } };
  const handleVoteHonor = (id: number) => { setTimeout(() => { setNominees(prev => prev.map(n => n.id === id ? { ...n, votes: n.votes + 15 } : n)); }, 40); };
  const handleCrystallization = () => { setGamePhase('TRIUMPH'); setTriumphTriggered(true); };

  const filteredChats = chatDatabase.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.chatId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appleTax = Math.round((parseFloat(dealAmount) || 0) * 0.27 * 100) / 100;
  const totalWithTax = Math.round(((parseFloat(dealAmount) || 0) + appleTax) * 100) / 100;

  return (
    <div className="w-full h-full flex flex-col justify-between font-sans antialiased text-slate-200">
      
      {/* ВЕРХНИЙ СЛОЙ: Тонкая и сжатая на 20% плашка 7 Балансов (max-w-[1152px]) */}
      <div className="w-full max-w-[1152px] mx-auto bg-gradient-to-r from-emerald-800/40 to-slate-800/70 border border-slate-700/40 rounded-xl p-1.5 pr-4 pb-2.5 pt-2.5 mb-4 shadow-xl relative shrink-0">
        <div className="flex flex-row items-center gap-2.5 overflow-x-auto scrollbar-none justify-between w-full">
          <div className="flex items-center gap-2 shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-2.5 py-0.5 rounded-lg">
            <div className="text-center">
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Личный Ларец</span>
              <span className="text-sm font-mono font-medium text-emerald-400">🪞 {balances.yntPersonal.toFixed(2)}</span>
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
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Вечевой Затвор</span>
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

          {/* УРОВЕНЬ II ТЕРЕМА (Фон 3) */}
          {activeChat === 3 && (
            <button onClick={() => setCurrentGornitsa('ALL')} className="w-full py-2 px-3 rounded-xl border border-amber-900/40 bg-amber-950/20 text-slate-400 font-mono font-bold text-center text-xs transition-all shrink-0 cursor-pointer">📢 Вечевой Набат</button>
          )}

          {/* ФОН 5: Переключатель */}
          {activeChat === 5 && (
            <div className="w-full p-1.5 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-1 shrink-0 text-center select-none font-mono">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Допуск Управления Палатой</span>
              <button onClick={() => setAccessLevel(vesselAccessLevel === 'OPEN' ? 'CLOSED' : 'OPEN')} className="w-full py-1 rounded-lg text-[10px] border transition-all bg-slate-900 border-slate-700 text-slate-400">
                {vesselAccessLevel === 'CLOSED' ? '🔒 Закрытая Палата (Терем)' : '🍃 Открытая Поляна'}
              </button>
            </div>
          )}

          {/* ФОН 6: Пурга */}
          {activeChat === 6 && (
            <div className="w-full p-1.5 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-1 shrink-0 text-center select-none font-mono">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Метео-Шлюз Живой Погоды</span>
              <button onClick={() => setIsBlizzardActive(!isBlizzardActive)} className={`w-full py-1 rounded-lg text-[10px] border transition-all cursor-pointer ${isBlizzardActive ? 'bg-sky-950 border-sky-500 text-sky-400 font-bold animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                {isBlizzardActive ? '❄️ Ледяная Пурга (DoS)' : '☀️ Ясная Погода'}
              </button>
            </div>
          )}

          {/* ФОН 7: СЕЛЕКТОР ЧИНОВ И МОДЕН-МНОЖИТЕЛЕЙ [Veche_Vote_Weight_Engine] */}
          {activeChat === 7 && (
            <div className="w-full p-2 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-2 shrink-0 select-none font-mono text-center">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Чин Глобального Парламента</span>
              <div className="grid grid-cols-3 gap-1 bg-black/40 p-0.5 rounded-lg border border-slate-800/40">
                {(['ПРОХОЖИЙ', 'БОЯРИН', 'КУДЕСНИК'] as const).map((chin) => (
                  <button
                    key={chin}
                    onClick={() => setVecheChin(chin)}
                    className={`py-1 rounded text-[7px] uppercase font-bold transition-all cursor-pointer ${vecheChin === chin ? 'bg-cyan-800 text-white shadow-inner' : 'text-neutral-500'}`}
                  >
                    {chin === 'ПРОХОЖИЙ' ? 'Странник' : chin === 'БОЯРИН' ? '👑 Боярин' : '🔮 Кудесник'}
                  </button>
                ))}
              </div>
              <label className="flex items-center justify-between p-1 bg-[#161a1d]/40 border border-slate-800/60 rounded-lg cursor-pointer text-left">
                <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-tight">📐 Зодчий Вырия (x2.0 Оверлей)</span>
                <input type="checkbox" checked={isArchitectModifier} onChange={() => setIsArchitectModifier(!isArchitectModifier)} className="accent-cyan-500 w-3 h-3 cursor-pointer" />
              </label>
            </div>
          )}

          {/* ФОН 9: Симулятор */}
          {activeChat === 9 && (
            <div className="w-full p-1.5 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-1 shrink-0 text-center select-none font-mono">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Ручной Коновод Игрищ</span>
              <div className="grid grid-cols-3 gap-1 bg-black/40 p-0.5 rounded-lg border border-slate-800/40">
                {(['CROWDFUNDING', 'VOTE', 'TRIUMPH'] as const).map((p) => (
                  <button key={p} onClick={() => { setGamePhase(p); if(p !== 'TRIUMPH') setTriumphTriggered(false); }} className={`py-1 rounded text-[7.5px] uppercase font-bold transition-all text-center cursor-pointer ${gamePhase === p ? 'bg-amber-700 text-white' : 'text-neutral-500'}`}>
                    {p === 'CROWDFUNDING' ? 'Сбор' : p === 'VOTE' ? 'Вече' : 'Итог'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none mt-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => { setActiveChat(chat.id); if(chat.id !== 3) setCurrentGornitsa('ALL'); }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all border text-left cursor-pointer
                  ${activeChat === chat.id ? 'bg-gradient-to-r from-emerald-950/40 to-slate-800/40 border-emerald-500/30 shadow-inner' : 'bg-[#161a1d]/40 border-transparent hover:bg-slate-800/20'}`}
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
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: Ситуационный хай-тек центр Мирового Вече */}
        <div className={`flex-1 border border-slate-700/40 rounded-2xl flex flex-col overflow-hidden shadow-xl relative transition-all duration-500
          ${activeChat === 7 ? 'bg-gradient-to-b from-[#0b101d] to-[#080a12] border-cyan-900/40' : 'bg-[#1e2326]/60'}
          ${activeChat === 5 && vesselAccessLevel === 'CLOSED' ? 'bg-[#221e1a]/80 border-amber-900/40' : ''}
          ${activeChat === 6 && isBlizzardActive ? 'bg-[#0f1522]/90 border-sky-800/40' : ''}`}>
          
          {activeChat === 6 && isBlizzardActive && (
            <div className="absolute inset-0 bg-sky-400/5 pointer-events-none z-30 animate-pulse backdrop-blur-[1px] flex items-center justify-center font-mono text-[10px] text-sky-400 uppercase tracking-widest select-none">❄️ [ВЗВЕДЁН ЗАТВОР ЭКСТРЕМАЛЬНОЙ ПОГОДЫ — ЛЕДЯНАЯ ПУРГА] ❄️</div>
          )}

          {/* Шапка чата */}
          <div className="p-3 border-b border-slate-700/40 bg-black/10 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#161a1d] border border-slate-700/50 flex items-center justify-center text-sm shadow-sm">
                {chatDatabase.find(c => c.id === activeChat)?.icon || '🔔'}
              </div>
              <div className="leading-tight">
                <h3 className="text-xs font-semibold text-slate-200">
                  {activeChat === 7 ? 'Всемирный Сход Блокчейн-Парламента' : chatDatabase.find(c => c.id === activeChat)?.name}
                </h3>
                <span className="text-[10px] font-mono font-medium text-cyan-400 block mt-0.5 animate-pulse">
                  ● {activeChat === 7 ? `движ Веса Голоса x${(vecheChin === 'БОЯРИН' ? 1.5 : vecheChin === 'КУДЕСНИК' ? 2.0 : 1.0) * (isArchitectModifier ? 2.0 : 1.0)} взведён` : chatDatabase.find(c => c.id === activeChat)?.status}
                </span>
              </div>
            </div>

            {/* ИИ-АГЕНТЫ В ШАПКЕ ЧАТА (Фон 7 = Елена Премудрая 📖 + Дворецкий Места 🕵️‍♂️) */}
            {activeChat === 7 && (
              <div className="flex items-center gap-3 pr-2 select-none">
                <div className="text-xl animate-pulse cursor-help" title="Елена Премудрая 📖 осуществляет ИИ-модерацию Конов без галлюцинаций.">📖</div>
                <div className="text-xl animate-bounce duration-[4000ms] cursor-help" title="Дворецкий Места 🕵️‍♂️ проверяет серебряные ключи кворума.">🕵️‍♂️</div>
              </div>
            )}
            
            {activeChat === 6 && (
              <div className="flex items-center gap-2 pr-2 select-none"><div className="text-xl animate-bounce duration-[4500ms] cursor-help">📖</div></div>
            )}
            {activeChat === 9 && (
              <div className="flex items-center gap-3 pr-2 select-none"><div className="text-xs font-mono font-bold px-2 py-0.5 bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 rounded-lg shadow-sm">🏆 КАЗНА: {prizePool} YNT</div><div className="text-xl animate-pulse">🤪</div><div className="text-xl animate-bounce duration-[5000ms]">💤</div>
              </div>
            )}
            {activeChat === 3 && (
              <div className="flex items-center gap-2 pr-2"><button onClick={() => setIsDosAttack(!isDosAttack)} className="px-1.5 py-0.5 text-[8px] font-mono border rounded bg-slate-900 border-slate-700 text-slate-400">Стабильно</button><div className="text-xl animate-bounce duration-[4000ms]">🤪</div></div>
            )}
            {activeChat === 5 && (
              <div className="flex items-center gap-2 pr-2"><div className="text-xl animate-bounce duration-[4000ms] cursor-help">🕵️‍♂️</div></div>
            )}

            <span className="text-[9px] font-mono text-neutral-500 px-2 py-0.5 bg-neutral-950/30 rounded-lg">
              id: {chatDatabase.find(c => c.id === activeChat)?.chatId || 'unknown'}
            </span>
          </div>

          {/* ИНТЕРФЕЙС ИГРОВОГО СХОДА ДЛЯ ФОНА 7 (Мировое Вече) */}
          {activeChat === 7 && (
            <div className="w-full flex-1 flex flex-col p-4 overflow-hidden gap-3 justify-start overflow-y-auto scrollbar-none animate-fadeIn">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block text-center font-mono">[🏛️ Вечевой Помост Свитков Мировых Вопросов]</span>
              
              <div className="space-y-3 w-full font-mono select-none">
                {vecheProposals.map((prop) => (
                  <div 
                    key={prop.id}
                    className={`p-3 bg-black/40 border border-slate-800/80 rounded-xl flex flex-col gap-2.5 transition-all duration-500 relative
                      ${prop.isVetoActive ? 'border-red-600/50 bg-red-950/10 shadow-[0_0_10px_rgba(239,68,68,0.1)] animate-pulse' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-xs font-semibold text-slate-200 leading-tight">{prop.title}</h4>
                      <div className="text-right shrink-0">
                        <span className="text-[8px] text-neutral-500 uppercase font-bold block">Кворум</span>
                        <span className="text-xs font-bold text-cyan-400">{prop.quorum}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-600 to-emerald-500" style={{ width: `${prop.quorum}%` }}></div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1 border-t border-slate-900/40">
                      <div className="flex gap-4 text-[10px] text-slate-400">
                        <span>🟢 Любо: <b className="text-emerald-400">{prop.votesLubor}</b></span>
                        <span>🔴 Нелюбо: <b className="text-red-400">{prop.votesNelubor}</b></span>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleVecheVote(prop.id, 'LUBO')}
                          className="px-3 py-1 bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-700/50 hover:border-emerald-400 text-emerald-400 text-[9px] uppercase font-bold rounded-lg cursor-pointer shadow-sm transition-all active:scale-95"
                        >
                          🟢 Любо
                        </button>
                        
                        <button
                          onClick={() => handleVecheVote(prop.id, 'NELUBO')}
                          className={`px-3 py-1 border text-[9px] uppercase font-black rounded-lg cursor-pointer shadow-sm transition-all active:scale-95
                            ${prop.isVetoActive ? 'bg-red-950 border-red-500 text-red-400 animate-bounce' : 'bg-gradient-to-r from-red-950/40 to-slate-900 border-red-900/50 hover:border-red-400 text-red-400'}`}
                        >
                          🔴 Нелюбо
                        </button>
                      </div>
                    </div>

                    {prop.isVetoActive && (
                      <div className="text-[7.5px] font-bold text-red-400 tracking-wider uppercase text-center border-t border-red-900/30 pt-1 leading-none select-none">
                        ⚠️ Вето задействовано! Зарок Вепря требует заморозки по 40 YNT от 3 Бояр на 14 дней!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ПОДДЕРЖКА ОСТАЛЬНЫХ ФОНОВ (4, 5, 6, 9, 3) */}
          {activeChat !== 7 && (
            <>
              {activeChat === 4 && (
                <div className="w-full bg-[#161a1d]/60 p-2.5 border-b border-slate-700/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
                  <div className="flex items-center gap-2 min-w-0"><span className="text-lg animate-pulse">🌿</span><div className="leading-tight min-w-0"><span className="text-[10px] text-emerald-400 font-bold block">[Лоза Артели Проросла]</span><span className="text-[8px] text-neutral-500 truncate block">Световой бартер active. Залог 40 YNT запечён.</span></div></div>
                  <div className="flex items-center gap-2 bg-black/40 border border-slate-800 p-1.5 rounded-xl text-[10px] w-full md:max-w-xs justify-between">
                    <div className="flex flex-col gap-0.5"><div className="flex gap-1 text-slate-300"><span>Сумма:</span><input type="number" value={dealAmount} onChange={(e) => setDealAmount(e.target.value)} className="w-12 bg-transparent border-b border-slate-700 text-emerald-400 focus:outline-none text-center font-bold font-mono" /></div><span className="text-[8px] text-amber-500 font-bold">🍎 Tax 27%: +{appleTax} YNT</span></div>
                    <div className="w-px h-6 bg-slate-800"></div><div className="text-right leading-tight"><span className="text-[7.5px] text-neutral-500 block uppercase">Выход в Пул</span><span className="text-xs font-bold text-slate-200">{totalWithTax} YNT</span></div>
                    <button onClick={() => alert(`Транзакция запечена: ${totalWithTax} YNT.`)} className="px-2.5 py-1 bg-emerald-700 text-white text-[9px] font-bold rounded-lg cursor-pointer">💸 Оплатить</button>
                  </div>
                </div>
              )}
              {activeChat === 5 && vesselAccessLevel === 'CLOSED' && (
                <div className="w-full bg-amber-950/20 p-2.5 border-b border-amber-900/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
                  <div className="w-full md:max-w-xs space-y-1"><div className="flex justify-between text-[8px] font-bold text-amber-500 uppercase"><span>⚡ Вечевой Пульс Бунта против Управляющего</span><span>{rebellionPulse}%</span></div><div className="w-full bg-black/40 border border-slate-800 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-600 to-red-600" style={{ width: `${rebellionPulse}%` }}></div></div></div>
                  <div className="flex items-center gap-1.5"><span className="text-[8px] text-neutral-500 uppercase font-bold">Вето Бояр:</span><div className="flex gap-1">{boiarSignatures.map((signed, idx) => ( <button key={idx} onClick={() => { const updated = [...boiarSignatures]; updated[idx] = !updated[idx]; setBoiarSignatures(updated); setRebellionPulse(updated.filter(Boolean).length * 25 + 20); }} className={`w-5 h-5 rounded border text-[8px] font-bold flex items-center justify-center cursor-pointer ${signed ? 'bg-red-900/40 border-red-500 text-red-400' : 'bg-slate-900 border-slate-800 text-neutral-600'}`}>{signed ? '🔒' : '✍️'}</button> )) }</div></div>
                </div>
              )}
              {activeChat === 6 && (
                <div className="w-full p-2.5 bg-black/10 border-b border-slate-800/40 select-none text-center font-mono text-[9px] text-neutral-400 animate-fadeIn">[Генеральный План построек сопредельных Бояр взведён в фоне]</div>
              )}
              {activeChat === 9 && (
                <div className="w-full p-2.5 bg-black/10 border-b border-slate-800/40 select-none text-center font-mono text-[9px] text-neutral-400 animate-fadeIn">[Контур Богатырских Забав активен в автономном режиме фаз]</div>
              )}
            </>
          )}

          {/* Лента сообщений чата */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none flex flex-col justify-end bg-black/5">
            {displayMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[70%] leading-snug animate-fadeIn ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                {!msg.isMe && <span className="text-[9px] font-semibold text-emerald-400 mb-0.5 ml-1 font-mono">{msg.sender} {activeChat === 3 && `[${msg.tag}]`}</span>}
                <div className={`p-2.5 rounded-2xl border text-xs shadow-md break-words relative ${msg.tag === 'SYSTEM' ? 'border-amber-400 bg-amber-950/20 text-amber-200' : ''} ${msg.tag !== 'SYSTEM' && msg.isMe ? 'bg-gradient-to-r from-emerald-900/50 to-emerald-950/50 border-emerald-800/30 text-slate-100 rounded-br-sm' : msg.tag !== 'SYSTEM' ? 'bg-[#161a1d]/80 border-slate-800/60 text-slate-200 rounded-bl-sm' : ''}`}>
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[8px] font-mono text-neutral-500 leading-none">
                    <span>{msg.time}</span>
                    {msg.isMe && <span className="text-emerald-400 font-bold tracking-tighter">✓✓</span>}
                  </div>
                </div>
              </div>
            ))}
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