import React, { useState, useEffect } from 'react';

// [UI_Vessel_Zabavy_Core] + [UI_Vessel_Artel_Palata_Core] + [UI_Vessel_Gornitsa_Core] + [UI_Chests_View_Core]
// Палата Игрищ (Фон 9) — Трехфазный смарт-контракт Богатырских Забав с микро-очередью P2P_Queue_Lada
export default function IzbaComponent() {
  // 7 Истинных Балансов Казны
  const [balances, setBalances] = useState({
    yntPersonal: 1250.00,
    yntDeposit: 40.00,
    rayLight: '12 / 24',
    pathVeles: 450,
    pathPerun: 120, // Синяя молния ⚡ (Тропа Перуна подпитывает Лучики Чести)
    pathSvarog: 380,
    vecheLock: 'Взведён'
  });

  const totalGodsRays = balances.pathVeles + balances.pathPerun + balances.pathSvarog;

  // Стейты интерактивного поиска, горниц Терема, финтех-сделки и Палаты (Фон 5)
  const [searchQuery, setSearchText] = useState('');
  const [currentGornitsa, setCurrentGornitsa] = useState<'ALL' | 'BARTER' | 'CENZ' | 'CHRONICLES'>('ALL');
  const [dealAmount, setDealAmount] = useState('100');
  const [vesselAccessLevel, setAccessLevel] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [rebellionPulse, setRebellionPulse] = useState(45);
  const [boiarSignatures, setBoiarSignatures] = useState([true, false, false]);

  // ================= ФОН 9: СУВЕРЕННЫЕ СТЕЙТЫ БОГАТЫРСКИХ ЗАБАВ =================
  const [gamePhase, setGamePhase] = useState<'CROWDFUNDING' | 'VOTE' | 'TRIUMPH'>('CROWDFUNDING');
  const [prizePool, setPrizerPool] = useState(108); // Стартовый тяжелый табло-пул (Янтарь YNT)
  const [userChin, setUserChin] = useState<'БОЯРИН' | 'КУДЕСНИК' | 'ПРОХОЖИЙ'>('БОЯРИН');
  const [isUserInGame, setIsUserInGame] = useState(false);
  const [triumphTriggered, setTriumphTriggered] = useState(false);

  // Номинанты на [🏆 Вечевой Помост]
  const [nominees, setNominees] = useState([
    { id: 1, name: 'Боярин Добрыня', votes: 120, isWinner: false, glow: false },
    { id: 2, name: 'Кудесник Ратибор', votes: 145, isWinner: false, glow: false },
    { id: 3, name: 'Боярин Мстислав', votes: 95, isWinner: false, glow: false }
  ]);

  // Симуляция DoS-нагрузки Скомороха
  const [isDosAttack, setIsDosAttack] = useState(false);

  // Обновленная Матрица Фонов Портала по ТЗ (Добавлен Фон 9)
  const chatDatabase = [
    { id: 1, name: 'Родовая Поляна Чертога', type: 'Главный Экран', chatId: 'chertog_meadow_main', icon: '🌳', unread: 0, status: 'в сети' },
    { id: 2, name: 'Изба (Приватный чат)', type: 'Семейный Круг', chatId: 'izba_private_chat', icon: '🏡', unread: 0, status: 'в сети' },
    { id: 3, name: 'Простой Терем', type: 'Камерное Сообщество', chatId: 'prostoy_terem_community', icon: '🪵', unread: 3, status: 'был в сети 27 мин назад' },
    { id: 4, name: 'Терем-Артель', type: 'Рабочая Мастерская', chatId: 'terem_artel_workshop', icon: '🔨', unread: 0, status: 'кипит световой бартер' },
    { id: 5, name: 'Вечевая Палата', type: 'Локальный Форум', chatId: 'veche_palata_forum', icon: '🏛️', unread: 7, status: 'Бояре на помосте' },
    { id: 9, name: 'Игрища Кудесников', type: 'Палата Игрищ (Фон 9)', chatId: 'igrischa_kudesnik_pool', icon: '⚔️', unread: 1, status: 'Забавы взведены' }
  ];

  const [activeChat, setActiveChat] = useState(9); // Фон 9 активен по умолчанию для теста
  const [inputText, setInputText] = useState('');

  // Расширенная Берестяная Почта под Фоны 3, 4, 5, 9
  const [mailRepository, setMailRepository] = useState<{ [key: string]: Array<{ id: number; sender: string; text: string; time: string; isMe: boolean; tag: string }> }>({
    'prostoy_terem_community': [
      { id: 301, sender: 'Семейный Хранитель', text: '📜 [Указ] Горница защищена Коном Семейного Хранителя.', time: '14:20', isMe: false, tag: 'CHRONICLES' },
      { id: 302, sender: 'Брат Радомир', text: '🌾 Обменяю 10 Лучиков Света на 2 Янтаря в Горнице Бартера.', time: '14:22', isMe: false, tag: 'BARTER' }
    ],
    'terem_artel_workshop': [
      { id: 401, sender: 'Мастер Ратибор', text: '🔨 Лоза Артели проросла сочно, залог в 40 YNT успешно синхронизирован.', time: '10:15', isMe: false, tag: 'SYSTEM' }
    ],
    'veche_palata_forum': [
      { id: 501, sender: 'Дворецкий Места', text: '🗝️ Сбор взносов в Пул Игрищ (9 YNT) открыт.', time: '11:02', isMe: false, tag: 'SYSTEM' }
    ],
    'igrischa_kudesnik_pool': [
      { id: 901, sender: 'Емеля на Печи', text: '💤 Забавы взведены ладно. Ждем окончания фазы Янтарного Краудфандинга под замком [Anvil_Heavy_Lock].', time: '12:00', isMe: false, tag: 'SYSTEM' }
    ]
  });

  const getChatKeyById = (id: number) => {
    if (id === 3) return 'prostoy_terem_community';
    if (id === 4) return 'terem_artel_workshop';
    if (id === 5) return 'veche_palata_forum';
    if (id === 9) return 'igrischa_kudesnik_pool';
    return 'prostoy_terem_community';
  };

  const currentMessages = mailRepository[getChatKeyById(activeChat)] || [];
  const displayMessages = currentMessages.filter(msg => {
    if (activeChat !== 3) return true;
    if (currentGornitsa === 'ALL') return true;
    return msg.tag === currentGornitsa;
  });

  // Фаза I: Логика клика краудфандинга (Списание 9 YNT)
  const handleJoinGame = () => {
    if (userChin === 'ПРОХОЖИЙ') {
      alert("Отлуп ядра: Чин Прохожего слишком мал для Богатырских Забав!");
      return;
    }
    if (isUserInGame) return;
    setIsUserInGame(true);
    setPrizerPool(prev => prev + 9);
    setBalances(prev => ({ ...prev, yntPersonal: prev.yntPersonal - 9 }));
    alert("Успех: 9 Янтарей заблокировано под замок [Anvil_Heavy_Lock]! Твоя веха на Помосте.");
  };

  // Фаза II: Микро-очередь P2P_Queue_Lada с шагом 40 миллисекунд для голосования
  const handleVoteHonor = (id: number) => {
    const voteWeight = userChin === 'БОЯРИН' ? 1.5 : userChin === 'КУДЕСНИК' ? 2 : 1;
    setTimeout(() => {
      setNominees(prev => prev.map(nom => {
        if (nom.id === id) {
          return { ...nom, votes: nom.votes + Math.floor(10 * voteWeight) };
        }
        return nom;
      }));
    }, 40); // Жесткий шаг очереди 40 мс [P2P_Queue_Lada] против фризов
  };

  // Фаза III: Кристаллизация Триумфа на вечерней зорьке по Chislobog_P2P_Sync
  const handleCrystallization = () => {
    if (triumphTriggered) return;
    setGamePhase('TRIUMPH');
    setTriumphTriggered(true);
    setTimeout(() => {
      setNominees(prev => {
        const sorted = [...prev].sort((a, b) => b.votes - a.votes);
        return prev.map(nom => {
          if (nom.id === sorted[0].id) {
            return { ...nom, isWinner: true, glow: true, votes: nom.votes + 50 };
          }
          return nom;
        });
      });
    }, 3000); // 3 секунды золотой вспышки экрана по ТЗ
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Вы',
      text: isDosAttack && activeChat === 3 ? 'Ква-ква! 🐸' : inputText,
      time: '12:05',
      isMe: true,
      tag: 'GAME_CHAT'
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
            <button
              onClick={() => setCurrentGornitsa('ALL')}
              className="w-full py-2 px-3 rounded-xl border border-amber-900/40 bg-amber-950/20 text-slate-400 font-mono font-bold text-center text-xs transition-all shrink-0 cursor-pointer"
            >
              📢 Вечевой Набат
            </button>
          )}

          {/* ФОН 5: Переключатель */}
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

          {/* ФОН 9: МЕХАНИЧЕСКИЙ ПЕРЕКЛЮЧАТЕЛЬ ФАЗ ДЛЯ ТЕСТИРОВАНИЯ ЭКРАНА СТУПЕНИ 1 */}
          {activeChat === 9 && (
            <div className="w-full p-1.5 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-1 shrink-0 text-center select-none font-mono">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Ручной Коновод Игрищ</span>
              <div className="grid grid-cols-3 gap-1 bg-black/40 p-0.5 rounded-lg border border-slate-800/40">
                {(['CROWDFUNDING', 'VOTE', 'TRIUMPH'] as const).map((phase) => (
                  <button
                    key={phase}
                    onClick={() => { setGamePhase(phase); if(phase !== 'TRIUMPH') setTriumphTriggered(false); }}
                    className={`py-1 rounded text-[7.5px] uppercase font-bold transition-all text-center cursor-pointer
                      ${gamePhase === phase ? 'bg-amber-700 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    {phase === 'CROWDFUNDING' ? 'Сбор' : phase === 'VOTE' ? 'Вече' : 'Итог'}
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

        {/* ПРАВАЯ ПАНЕЛЬ: Интерактивная P2P Арена Богатырских Забав */}
        <div className={`flex-1 border border-slate-700/40 rounded-2xl flex flex-col overflow-hidden shadow-xl relative transition-all duration-500
          ${activeChat === 9 ? 'bg-gradient-to-b from-[#10131c] to-[#0b0d14] border-cyan-900/30' : 'bg-[#1e2326]/60'}`}>
          
          {/* Шапка чата */}
          <div className="p-3 border-b border-slate-700/40 bg-black/10 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#161a1d] border border-slate-700/50 flex items-center justify-center text-sm shadow-sm">
                {chatDatabase.find(c => c.id === activeChat)?.icon || '⚔️'}
              </div>
              <div className="leading-tight">
                <h3 className="text-xs font-semibold text-slate-200">
                  {activeChat === 9 ? 'Неоновая P2P-Арена Богатырских Забав' : chatDatabase.find(c => c.id === activeChat)?.name}
                </h3>
                <span className="text-[10px] font-mono font-medium text-emerald-400 block mt-0.5 animate-pulse">
                  ● {chatDatabase.find(c => c.id === activeChat)?.status || 'в сети'}
                </span>
              </div>
            </div>

            {/* ИИ-АГЕНТЫ НА ФОНЕ 9: Парящие Скоморох 🤪 и Емеля на печи 💤 */}
            {activeChat === 9 && (
              <div className="flex items-center gap-3 pr-2 select-none">
                <div className="text-xs font-mono font-bold px-2 py-0.5 bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 rounded-lg shadow-sm">
                  🏆 КАЗНА: {prizePool} YNT
                </div>
                <div className="text-xl animate-pulse cursor-help" title="ИИ-Скоморох 🤪 пускает зайчики при простое">🤪</div>
                <div className="text-xl animate-bounce duration-[5000ms] cursor-help" title="ИИ-Емеля 💤 зевает на печи">💤</div>
              </div>
            )}

            {activeChat === 3 && (
              <div className="flex items-center gap-2 pr-2">
                <button onClick={() => setIsDosAttack(!isDosAttack)} className={`px-1.5 py-0.5 text-[8px] font-mono border rounded uppercase cursor-pointer ${isDosAttack ? 'bg-red-950 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>{isDosAttack ? '💥 Атака!' : 'Стабильно'}</button>
                <div className="text-xl animate-bounce duration-[4000ms]">🤪</div>
              </div>
            )}
            
            {activeChat === 5 && (
              <div className="flex items-center gap-2 pr-2">
                <div className="text-xl animate-bounce duration-[4000ms] cursor-help">🕵️‍♂️</div>
              </div>
            )}

            <span className="text-[9px] font-mono text-neutral-500 px-2 py-0.5 bg-neutral-950/30 rounded-lg">
              id: {chatDatabase.find(c => c.id === activeChat)?.chatId || 'unknown'}
            </span>
          </div>

          {/* ИНТЕРФЕЙС ИГРИЩ ДЛЯ ФОНА 9 (Богатырские Забавы) */}
          {activeChat === 9 && (
            <div className="w-full flex-1 flex flex-col p-4 overflow-hidden gap-4 justify-between">
              
              {/* [🏆 Вечевой Помост] — Графическая неоновая арена со графиками голосов */}
              <div className={`w-full bg-black/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 justify-center items-center relative transition-all duration-700 min-h-[160px]
                ${gamePhase === 'TRIUMPH' && triumphTriggered ? 'border-amber-500/50 bg-amber-950/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : ''}`}>
                
                {/* Золотая вспышка экрана Фазы III */}
                {gamePhase === 'TRIUMPH' && !triumphTriggered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 animate-pulse z-20 rounded-2xl flex items-center justify-center font-mono font-black text-amber-400 text-sm tracking-widest uppercase select-none">
                    ✨ КРИСТАЛЛИЗАЦИЯ ТРИУМФА... ✨
                  </div>
                )}

                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider font-mono">[🏆 Вечевой Помост Номинантов]</span>
                
                <div className="grid grid-cols-3 gap-4 w-full max-w-md select-none font-mono">
                  {nominees.map((nom) => {
                    const maxVotes = Math.max(...nominees.map(n => n.votes));
                    const isCurrentLeader = nom.votes === maxVotes && gamePhase === 'TRIUMPH' && triumphTriggered;

                    return (
                      <div 
                        key={nom.id} 
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center relative
                          ${isCurrentLeader 
                            ? 'bg-amber-950/40 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-105 font-bold' 
                            : 'bg-[#161a1d]/60 border-slate-800 text-slate-300'}`}
                      >
                        {isCurrentLeader && <span className="absolute -top-2.5 text-base animate-bounce">👑</span>}
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/60 flex items-center justify-center text-lg shadow-sm">
                          {nom.id === 1 ? '🧔' : nom.id === 2 ? '🧙‍♂️' : '🛡️'}
                        </div>
                        <div className="leading-tight min-w-0 w-full">
                          <span className="text-[10px] block truncate">{nom.name}</span>
                          <span className={`text-[11px] block mt-1 font-bold ${isCurrentLeader ? 'text-amber-400' : 'text-cyan-400'}`}>{nom.votes} Лучей</span>
                        </div>

                        {/* Фаза II: Кнопка скоростного P2P голосования очереди [Honor_Vote_UI_Phase] */}
                        {gamePhase === 'VOTE' && (
                          <button
                            onClick={() => handleVoteHonor(nom.id)}
                            className="mt-1 w-full py-1 bg-gradient-to-r from-cyan-900 to-slate-900 border border-cyan-700/50 hover:border-cyan-400 text-cyan-300 text-[8px] uppercase font-bold rounded transition-all active:scale-95 cursor-pointer shadow-sm"
                          >
                            ⚡ Отдать Честь
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* НИЖНИЙ ПУЛЬТ УПРАВЛЕНИЯ ФАЗАМИ СМАРТ-КОНТРАКТА КАЗНЫ */}
              <div className="w-full bg-black/20 border border-slate-800/60 rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none">
                
                {/* Фаза I: Интерфейс Янтарного Краудфандинга */}
                {gamePhase === 'CROWDFUNDING' && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 justify-between w-full">
                    <div className="leading-tight text-center sm:text-left">
                      <span className="text-[10px] text-amber-500 font-bold block"> Фаза I. Янтарный Краудфандинг (48 часов)</span>
                      <span className="text-[8px] text-neutral-500">Взнос 9 YNT блокируется под замком [Anvil_Heavy_Lock]</span>
                    </div>
                    <button
                      onClick={handleJoinGame}
                      disabled={isUserInGame}
                      className={`px-4 py-2 text-xs font-bold uppercase rounded-xl border transition-all active:scale-95 shadow-md cursor-pointer
                        ${isUserInGame 
                          ? 'bg-slate-900 border-slate-800 text-neutral-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-500/40 text-white hover:from-amber-500 hover:to-orange-500'}`}
                    >
                      {isUserInGame ? 'В Забаве ⚔️' : '⚔️ Вступить в Забаву'}
                    </button>
                  </div>
                )}

                {/* ...Остальные Фазы (Вложены в Часть 1) */}
                {gamePhase === 'VOTE' && (
                  <div className="flex flex-row items-center gap-3 justify-between w-full">
                    <div className="leading-tight">
                      <span className="text-[10px] text-cyan-400 font-bold block">⚡ Фаза II. Голосование Чести (Очередь 40 мс)</span>
                      <span className="text-[8px] text-neutral-500">Лучики Чести с Тропы Перуна множатся</span>
                    </div>
                    <button onClick={handleCrystallization} className="px-3 py-1.5 bg-gradient-to-r from-amber-700 to-yellow-600 border border-amber-500 text-white text-[9px] font-black uppercase rounded-lg cursor-pointer">🌅 Закрыть</button>
                  </div>
                )}

                {gamePhase === 'TRIUMPH' && (
                  <div className="flex flex-col gap-1 w-full text-[9px] text-neutral-400">
                    <div className="flex justify-between border-b border-slate-800/20 pb-0.5"><span className="text-amber-400 font-bold">🥇 Победитель Триумфа (72%):</span><span className="text-slate-200">+{((prizePool * 0.72)).toFixed(2)} YNT</span></div>
                    <div className="flex justify-between border-b border-slate-800/20 pb-0.5"><span className="text-emerald-400">🏛️ Казна Места Палаты (13%):</span><span className="text-slate-300">+{((prizePool * 0.13)).toFixed(2)} YNT</span></div>
                    <div className="flex justify-between text-red-400"><span>🔥 Системное Сжигание (15%):</span><span className="font-bold">-{((prizePool * 0.15)).toFixed(2)} YNT</span></div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ПОДДЕРЖКА СТАНДАРТНЫХ ЧАТОВ */}
          {activeChat !== 9 && (
            <>
              {activeChat === 4 && (
                <div className="w-full bg-[#161a1d]/60 p-2.5 border-b border-slate-700/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg animate-pulse">🌿</span>
                    <div className="leading-tight min-w-0">
                      <span className="text-[10px] text-emerald-400 font-bold block">[Лоза Артели Проросла]</span>
                      <span className="text-[8px] text-neutral-500 truncate block">Световой бартер active. Залог 40 YNT запечён.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 border border-slate-800 p-1.5 rounded-xl text-[10px] w-full md:max-w-xs justify-between">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex gap-1 text-slate-300">
                        <span>Сумма:</span>
                        <input type="number" value={dealAmount} onChange={(e) => setDealAmount(e.target.value)} className="w-12 bg-transparent border-b border-slate-700 text-emerald-400 focus:outline-none text-center font-bold font-mono" />
                      </div>
                      <span className="text-[8px] text-amber-500 font-bold">🍎 Tax 27%: +{appleTax} YNT</span>
                    </div>
                    <div className="w-px h-6 bg-slate-800"></div>
                    <div className="text-right leading-tight">
                      <span className="text-[7.5px] text-neutral-500 block uppercase">Выход в Пул</span>
                      <span className="text-xs font-bold text-slate-200">{totalWithTax} YNT</span>
                    </div>
                    <button onClick={() => alert(`Транзакция запечена: ${totalWithTax} YNT.`)} className="px-2.5 py-1 bg-emerald-700 text-white text-[9px] font-bold rounded-lg cursor-pointer">💸 Оплатить</button>
                  </div>
                </div>
              )}

              {activeChat === 5 && vesselAccessLevel === 'CLOSED' && (
                <div className="w-full bg-amber-950/20 p-2.5 border-b border-amber-900/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
                  <div className="w-full md:max-w-xs space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-amber-500 uppercase">
                      <span>⚡ Вечевой Пульс Бунта против Управляющего</span>
                      <span>{rebellionPulse}%</span>
                    </div>
                    <div className="w-full bg-black/40 border border-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-red-600" style={{ width: `${rebellionPulse}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] text-neutral-500 uppercase font-bold">Вето Бояр:</span>
                    <div className="flex gap-1">
                      {boiarSignatures.map((signed, idx) => (
                        <button key={idx} onClick={() => { const updated = [...boiarSignatures]; updated[idx] = !updated[idx]; setBoiarSignatures(updated); setRebellionPulse(updated.filter(Boolean).length * 25 + 20); }} className={`w-5 h-5 rounded border text-[8px] font-bold flex items-center justify-center cursor-pointer ${signed ? 'bg-red-900/40 border-red-500 text-red-400' : 'bg-slate-900 border-slate-800 text-neutral-600'}`}>{signed ? '🔒' : '✍️'}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeChat === 3 && (
                <div className="w-full bg-black/10 p-2 border-b border-slate-700/20 flex flex-row items-center gap-3 justify-center shrink-0 overflow-x-auto scrollbar-none select-none">
                  <button onClick={() => setCurrentGornitsa('BARTER')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer ${currentGornitsa === 'BARTER' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>🌾 Горница Бартера</button>
                  <button onClick={() => setCurrentGornitsa('CENZ')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer ${currentGornitsa === 'CENZ' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>🛡️ Горница Ценза</button>
                  <button onClick={() => setCurrentGornitsa('CHRONICLES')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer ${currentGornitsa === 'CHRONICLES' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>📜 Горница Летописей</button>
                </div>
              )}
            </>
          )}

          {/* Лента сообщений чата */}
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