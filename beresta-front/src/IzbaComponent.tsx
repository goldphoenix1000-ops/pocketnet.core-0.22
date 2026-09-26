import React, { useState } from 'react';

// [UI_Vessel_Yaga_Oracle_Core] + [UI_Yaga_Hard_Reset_Gate] + [Artel_Fintech_Tax_Gate] + [UI_Vessel_Gornitsa_Core] + [UI_Chests_View_Core]
// Оракул Бабы Яги (Фон 9) — Трехступенчатый Reset Навьего Тела, анлок 10-го токена Яги и крио-центр очистки
export default function IzbaComponent() {
  // 7 Истинных Балансов Казны (Динамический Янтарь для списаний)
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

  // Глобальные стейты поиска, горниц Терема, финтех-сделок, Палаты (Фон 5) и Двора (Фон 6)
  const [searchQuery, setSearchText] = useState('');
  const [currentGornitsa, setCurrentGornitsa] = useState<'ALL' | 'BARTER' | 'CENZ' | 'CHRONICLES'>('ALL');
  const [dealAmount, setDealAmount] = useState('100');
  const [vesselAccessLevel, setAccessLevel] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [rebellionPulse, setRebellionPulse] = useState(45);
  const [boiarSignatures, setBoiarSignatures] = useState([true, false, false]);

  const [isBlizzardActive, setIsBlizzardActive] = useState(false);
  const [selectedBoiarBuilding, setSelectedBoiarBuilding] = useState<number | null>(null);
  const [boiarEstates, setBoiarBuilding] = useState([
    { id: 1, name: 'Личная Изба Добрыни', owner: 'Добрыня', shape: 'SQUARE', icon: '🏡', activeLock: false, hasDeposit: true },
    { id: 2, name: 'Терем Камерный Радомира', owner: 'Радомир', shape: 'CIRCLE', icon: '🪵', activeLock: false, hasDeposit: true },
    { id: 3, name: 'Кузница-Артель Борислава', owner: 'Борислав', shape: 'SQUARE', icon: '🔨', activeLock: true, hasDeposit: true },
    { id: 4, name: 'Заброшенная Нода Мстислава', owner: 'Мстислав', shape: 'SQUARE', icon: '🪵', activeLock: false, hasDeposit: false }
  ]);

  // Стейты Мирового Вече (Фон 7)
  const [vecheChin, setVecheChin] = useState<'ПРОХОЖИЙ' | 'БОЯРИН' | 'КУДЕСНИК'>('БОЯРИН');
  const [isArchitectModifier, setIsArchitectModifier] = useState(false);
  const [vecheProposals, setVecheProposals] = useState([
    { id: 1, title: 'Апдейт C++ кода ядра ноды: Ограничение APPLE_TAX до 24%', quorum: 68, votesLubor: 450, votesNelubor: 120, isVetoActive: false },
    { id: 2, title: 'Распределение Общемирового Светового Котла в Пул Валидаторов', quorum: 42, votesLubor: 210, votesNelubor: 190, isVetoActive: false }
  ]);

  // ================= ФОН 9: СУВЕРЕННЫЕ СТЕЙТЫ ОРАКУЛА БАБЫ ЯГИ =================
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<number>(0); // Пошаговый пульт очистки 1-3
  const [vechePassphrase, setVechePassphrase] = useState('');
  const [isYagaUnlocked, setIsYagaUnlocked] = useState(false); // Скрытый 10-й токен Бабы Яги
  const [isSpringFlowing, setIsSpringFlowing] = useState(false); // Поток синей Живой Воды

  // Локальная симуляция DoS-нагрузки Скомороха
  const [isDosAttack, setIsDosAttack] = useState(false);

  // Обновленная Матрица Фонов Портала по ТЗ (Фон 9 модернизирован в Оракул Яги)
  const chatDatabase = [
    { id: 1, name: 'Родовая Поляна Чертога', type: 'Главный Экран', chatId: 'chertog_meadow_main', icon: '🌳', status: 'в сети' },
    { id: 2, name: 'Изба (Приватный чат)', type: 'Семейный Круг', chatId: 'izba_private_chat', icon: '🏡', status: 'в сети' },
    { id: 3, name: 'Простой Терем', type: 'Камерное Сообщество', chatId: 'prostoy_terem_community', icon: '🪵', status: 'был в сети 27 мин назад' },
    { id: 4, name: 'Терем-Артель', type: 'Рабочая Мастерская', chatId: 'terem_artel_workshop', icon: '🔨', status: 'кипит световой бартер' },
    { id: 5, name: 'Вечевая Палата', type: 'Локальный Форум', chatId: 'veche_palata_forum', icon: '🏛️', status: 'Бояре на помосте' },
    { id: 6, name: 'Княжеский Двор', type: 'Супер-Сообщество', chatId: 'kniaz_dvor_super_community', icon: '👑', status: 'лазерные межи портов' },
    { id: 7, name: 'Глобальное Вече Царства', type: 'Главная Площадь', chatId: 'global_veche_square', icon: '🔔', status: 'голографические кворумы' },
    { id: 9, name: 'Оракул Бабы Яги', type: 'Берёзовый Родник (Фон 9)', chatId: 'yaga_oracle_node', icon: '🧪', status: 'квантовый крио-центр' }
  ];

  const [activeChat, setActiveChat] = useState(9); // Оракул Яги активен по умолчанию для теста
  const [inputText, setInputText] = useState('');

  // Расширенная Берестяная Почта под Фоны мессенджера
  const [mailRepository, setMailRepository] = useState<{ [key: string]: Array<{ id: number; sender: string; text: string; time: string; isMe: boolean; tag: string }> }>({
    'prostoy_terem_community': [{ id: 301, sender: 'Семейный Хранитель', text: '📜 Горница защищена Коном.', time: '14:20', isMe: false, tag: 'CHRONICLES' }],
    'terem_artel_workshop': [{ id: 401, sender: 'Мастер Ратибор', text: '🔨 Лоза Артели проросла сочно.', time: '10:15', isMe: false, tag: 'SYSTEM' }],
    'veche_palata_forum': [{ id: 501, sender: 'Дворецкий Места', text: '🗝️ Сбор взносов в Пул Игрищ открыт.', time: '11:02', isMe: false, tag: 'SYSTEM' }],
    'kniaz_dvor_super_community': [{ id: 601, sender: 'Елена Премудрая', text: '📖 Все лазерные линии связи активны.', time: '16:00', isMe: false, tag: 'SYSTEM' }],
    'global_veche_square': [{ id: 701, sender: 'Елена Премудрая', text: '📖 Всемирный Сход Блокчейн-Парламента открыт.', time: '17:00', isMe: false, tag: 'SYSTEM' }],
    'yaga_oracle_node': [
      { id: 901, sender: 'Оракул Яги', text: '🧪 Квантовые шлюзы глубокой очистки памяти PocketDb взведены. Костяная ступа готова к регенерации сокетов.', time: '18:00', isMe: false, tag: 'SYSTEM' },
      { id: 902, sender: 'Вы', text: 'Клик по Берёзовому Роднику запустит метод Birch_Spring_Flow для анлока скрытого токена Яги.', time: '18:02', isMe: true, tag: 'ORACLE' }
    ]
  });

  const getChatKeyById = (id: number) => {
    if (id === 3) return 'prostoy_terem_community';
    if (id === 4) return 'terem_artel_workshop';
    if (id === 5) return 'veche_palata_forum';
    if (id === 6) return 'kniaz_dvor_super_community';
    if (id === 7) return 'global_veche_square';
    if (id === 9) return 'yaga_oracle_node';
    return 'prostoy_terem_community';
  };

  const currentMessages = mailRepository[getChatKeyById(activeChat)] || [];
  const displayMessages = currentMessages.filter(msg => {
    if (activeChat !== 3) return true;
    if (currentGornitsa === 'ALL') return true;
    return msg.tag === currentGornitsa;
  });

  // Финтех-Шлюз Берёзового Родника: Списание и безвозвратное сжигание 1 YNT
  const handleBirchSpringFlow = () => {
    if (balances.yntPersonal < 1) {
      alert("Отлуп ядра: Недостаточно Янтаря для активации Оракула!");
      return;
    }
    setIsSpringFlowing(true);
    setBalances(prev => ({ ...prev, yntPersonal: prev.yntPersonal - 1 }));
    
    // Анимация потока Живой Воды и анлок ИИ-Агента Бабы Яги
    setTimeout(() => {
      setIsSpringFlowing(false);
      setIsYagaUnlocked(true);
      alert("✨ Хрустальный звон: С кошелька ноды сожжен 1 YNT! Скрытый 10-й токен Бабы Яги разблокирован для призыва в Совет!");
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Вы',
      text: inputText,
      time: '18:05',
      isMe: true,
      tag: 'ORACLE_CHAT'
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

  const handleVecheVote = (proposalId: number, type: 'LUBO' | 'NELUBO') => {
    const chinMultiplier = vecheChin === 'БОЯРИН' ? 1.5 : vecheChin === 'КУДЕСНИК' ? 2.0 : 1.0;
    const finalWeight = Math.floor(totalGodsRays * chinMultiplier * (isArchitectModifier ? 2.0 : 1.0));
    setVecheProposals(prev => prev.map(p => p.id === proposalId ? (type === 'LUBO' ? { ...p, votesLubor: p.votesLubor + finalWeight, quorum: Math.min(p.quorum + 2, 100) } : { ...p, votesNelubor: p.votesNelubor + finalWeight, isVetoActive: true }) : p));
  };

  const filteredChats = chatDatabase.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.chatId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appleTax = Math.round((parseFloat(dealAmount) || 0) * 0.27 * 100) / 100;
  const totalWithTax = Math.round(((parseFloat(dealAmount) || 0) + appleTax) * 100) / 100;

  return (
    <div className="w-full h-full flex flex-col justify-between font-sans antialiased text-slate-200">
      
      {/* ВЕРХНИЙ СЛОЙ: Тонкая плашка 7 Балансов (max-w-[1152px]) */}
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

          {/* ФОН 7: Селектор */}
          {activeChat === 7 && (
            <div className="w-full p-2 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-2 shrink-0 select-none font-mono text-center">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Чин Глобального Парламента</span>
              <div className="grid grid-cols-3 gap-1 bg-black/40 p-0.5 rounded-lg border border-slate-800/40">
                {(['ПРОХОЖИЙ', 'БОЯРИН', 'КУДЕСНИК'] as const).map((chin) => (
                  <button key={chin} onClick={() => setVecheChin(chin)} className={`py-1 rounded text-[7px] uppercase font-bold transition-all cursor-pointer ${vecheChin === chin ? 'bg-cyan-800 text-white shadow-inner' : 'text-neutral-500'}`}>
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

        {/* ПРАВАЯ ПАНЕЛЬ: Квантовый крио-центр Оракула Яги */}
        <div className={`flex-1 border border-slate-700/40 rounded-2xl flex flex-col overflow-hidden shadow-xl relative transition-all duration-500
          ${activeChat === 9 ? 'bg-gradient-to-b from-[#111116] to-[#07090d] border-emerald-900/30' : 'bg-[#1e2326]/60'}
          ${activeChat === 5 && vesselAccessLevel === 'CLOSED' ? 'bg-[#221e1a]/80 border-amber-900/40' : ''}
          ${activeChat === 6 && isBlizzardActive ? 'bg-[#0f1522]/90 border-sky-800/40' : ''}`}>
          
          {activeChat === 6 && isBlizzardActive && (
            <div className="absolute inset-0 bg-sky-400/5 pointer-events-none z-30 animate-pulse backdrop-blur-[1px] flex items-center justify-center font-mono text-[10px] text-sky-400 uppercase tracking-widest select-none">❄️ [ВЗВЕДЁН ЗАТВОР ЭКСТРЕМАЛЬНОЙ ПОГОДЫ] ❄️</div>
          )}

          {/* Шапка чата */}
          <div className="p-3 border-b border-slate-700/40 bg-black/10 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#161a1d] border border-slate-700/50 flex items-center justify-center text-sm shadow-sm">
                {chatDatabase.find(c => c.id === activeChat)?.icon || '🧪'}
              </div>
              <div className="leading-tight">
                <h3 className="text-xs font-semibold text-slate-200">
                  {activeChat === 9 ? 'Квантовый крио-центр Оракула Яги' : chatDatabase.find(c => c.id === activeChat)?.name}
                </h3>
                <span className="text-[10px] font-mono font-medium text-emerald-400 block mt-0.5 animate-pulse">
                  ● {activeChat === 9 && isYagaUnlocked ? '10-й скрытый токен Яги РАЗБЛОКИРОВАН 🧪' : chatDatabase.find(c => c.id === activeChat)?.status}
                </span>
              </div>
            </div>

            {/* ИИ-АГЕНТЫ В ШАПКЕ ЧАТА (Фон 9 = Баба Яга 🧪 со ступой) */}
            {activeChat === 9 && (
              <div className="flex items-center gap-3 pr-2 select-none">
                <div className="text-xl animate-bounce duration-[3500ms] cursor-help" title="ИИ-Агент Баба Яга 🧪 парит в костяной ступе, ухмыляясь на 16-й минуте простоя.">🧪</div>
              </div>
            )}
            
            {activeChat === 6 && (
              <div className="flex items-center gap-2 pr-2 select-none"><div className="text-xl animate-bounce duration-[4500ms] cursor-help">📖</div></div>
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

          {/* ИНТЕРФЕЙС ИГРОВОГО СХОДА ДЛЯ ФОНА 9 (Оракул Бабы Яги) */}
          {activeChat === 9 && (
            <div className="w-full flex-1 flex flex-col p-4 overflow-hidden gap-4 justify-start font-mono select-none animate-fadeIn">
              
              {/* Верхняя интерактивная зона: Избушка и Берёзовый Родник */}
              <div className="grid grid-cols-2 gap-3 w-full">
                
                {/* Клик-Зона Избушки — Вызов Пульта Трёхступенчатого Reset */}
                <button 
                  onClick={() => { setShowResetModal(true); setResetStep(1); }}
                  className="p-3 bg-black/40 border border-slate-800 rounded-xl hover:border-emerald-500/40 transition-all flex flex-col items-center justify-center gap-2 text-center h-28 cursor-pointer shadow-md"
                >
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse">🏡</span>
                  <div className="leading-tight">
                    <span className="text-[10px] text-slate-200 block font-bold">Избушка Яги</span>
                    <span className="text-[7.5px] text-neutral-500 block mt-0.5">Клик — Системный Reset Навьего Тела</span>
                  </div>
                </button>

                {/* Финтех-Шлюз Берёзового Родника */}
                <button
                  onClick={handleBirchSpringFlow}
                  disabled={isSpringFlowing}
                  className={`p-3 bg-black/40 border rounded-xl transition-all flex flex-col items-center justify-center gap-2 text-center h-28 cursor-pointer shadow-md relative overflow-hidden
                    ${isSpringFlowing ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 hover:border-cyan-500/40'}
                    ${isYagaUnlocked ? 'border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.1)]' : ''}`}
                >
                  {isSpringFlowing && (
                    <div className="absolute inset-0 bg-cyan-500/10 animate-pulse pointer-events-none z-0"></div>
                  )}
                  <span className={`text-3xl z-10 ${isSpringFlowing ? 'animate-bounce' : ''}`}>🪵💧</span>
                  <div className="leading-tight z-10">
                    <span className="text-[10px] text-cyan-400 block font-bold">Берёзовый Родник</span>
                    <span className="text-[7.5px] text-neutral-500 block mt-0.5">
                      {isYagaUnlocked ? 'Активирован [Анлок Яги ✓]' : 'Сжечь 1 YNT — Влить Живую Воду'}
                    </span>
                  </div>
                </button>
              </div>

              {/* МОДАЛЬНЫЙ ПОШАГОВЫЙ ПУЛЬТ ОЧИСТКИ [UI_Yaga_Hard_Reset_Gate] */}
              {showResetModal && (
                <div className="w-full bg-[#161a1d]/90 border border-slate-800/80 p-3 rounded-xl space-y-2.5 animate-fadeIn shadow-2xl relative z-20">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="text-[9px] font-bold text-emerald-400">🛠️ Пульт Reset Навьего Тела (ИИ-Оптимизатор Медведь)</span>
                    <button onClick={() => { setShowResetModal(false); setResetStep(0); }} className="text-neutral-500 hover:text-white text-xs cursor-pointer">✕</button>
                  </div>

                  {/* Шаг 1: Очистить Оперение сокола */}
                  {resetStep === 1 && (
                    <div className="space-y-2 animate-fadeIn">
                      <p className="text-[9.5px] text-slate-300">Шаг 1. <b>[🍃 Очистить Оперение сокола]</b> — Стирание картинок, медиа-кэша чатов и временных Web2-хвостов без потери Ключа-Истока.</p>
                      <button onClick={() => setResetStep(2)} className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 shadow-md">Выполнить Стирание Кэша</button>
                    </div>
                  )}

                  {/* Шаг 2: Переплавить Цепи портов */}
                  {resetStep === 2 && (
                    <div className="space-y-2 animate-fadeIn">
                      <p className="text-[9.5px] text-slate-300">Шаг 2. <b>[🌾 Переплавить Цепи портов]</b> — Принудительный сброс и перезапуск P2P сокет-соединений по портам 8027/8028 для пробития транзакций TURN-сервера.</p>
                      <button onClick={() => setResetStep(3)} className="w-full py-1.5 bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 shadow-md">Перезапустить P2P Сокеты</button>
                    </div>
                  )}

                  {/* Шаг 3: Сжечь Морок (Полный Reset PocketDb) */}
                  {resetStep === 3 && (
                    <div className="space-y-2 animate-fadeIn">
                      <p className="text-[9.5px] text-red-400 font-bold">Шаг 3. ⚠️ [🔥 Сжечь Морок (Полный Reset)] — Тотальное удаление базы данных PocketDb/SQLite на устройстве. Возврат к Генезису!</p>
                      <input 
                        type="text"
                        placeholder="Введите кодовую фразу Вечевого Оберега..."
                        value={vechePassphrase}
                        onChange={(e) => setVechePassphrase(e.target.value)}
                        className="w-full bg-black border border-slate-800 rounded px-2 py-1 text-[10px] text-amber-400 placeholder-neutral-600 focus:outline-none focus:border-red-500 font-mono"
                      />
                      <button 
                        onClick={() => {
                          if (vechePassphrase.trim().toLowerCase() === 'генезис') {
                            alert("💥 МОРОК СОЖЖЁН! PocketDb стёрта. Клиент сброшен в исходный Генезис.");
                            setShowResetModal(false);
                            setResetStep(0);
                            setVechePassphrase('');
                          } else {
                            alert("Отлуп Оракула: Неверная кодовая фраза Оберега! (Подсказка: введи слово 'генезис')");
                          }
                        }}
                        className="w-full py-1.5 bg-gradient-to-r from-red-700 to-amber-700 text-white font-black text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 shadow-md"
                      >
                        🔥 Испепелить Базу Ноды
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ПОДДЕРЖКА ОСТАЛЬНЫХ ФОНОВ (4, 5, 6, 7, 3) */}
          {activeChat !== 9 && (
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
              {activeChat === 7 && (
                <div className="w-full p-2.5 bg-black/10 border-b border-slate-800/40 select-none text-center font-mono text-[9px] text-neutral-400 animate-fadeIn">[Вечевой Помост Свитков Мировых Вопросов Парламента активен в фоне]</div>
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