import React, { useState } from 'react';
import { BerestaBridgeService } from './services/berestaBridge';

const bridge = new BerestaBridgeService();

// [UI_Vessel_Vyriy_Market_Core] + [UI_Vessel_Izba_Core] + [Artel_Fintech_Tax_Gate]
// ПОЛНАЯ ИСПРАВЛЕННАЯ СБОРКА: Мессенджер "Синего Вестника" с возвращенным Фона 8 (Торговый Вырий)
export default function IzbaComponent() {
   // Истинные Балансы Казны с подгрузкой из локальной энергонезависимой памяти компьютера
  const [balances, setBalances] = useState(() => {
    const savedYnt = localStorage.getItem('beresta_ynt_personal');
    return {
      yntPersonal: savedYnt ? parseFloat(savedYnt) : 1241.00,
      yntDeposit: 40.00,
      rayLight: '12 / 24',
      pathVeles: 450,
      pathPerun: 120,
      pathSvarog: 380,
      vecheLock: 'Взведён'
    };
  });

  const totalGodsRays = balances.pathVeles + balances.pathPerun + balances.pathSvarog;

  const [searchQuery, setSearchText] = useState('');
  const [activeChat, setActiveChat] = useState(2); // Изба на старте

  // Стейты Фона 3 (Простой Терем)
  const [currentGornitsa, setCurrentGornitsa] = useState<'ALL' | 'BARTER' | 'CENZ' | 'CHRONICLES'>('ALL');
  const [isDosAttack, setIsDosAttack] = useState(false);

  // Стейты Фона 4 (Торговая Артель)
  const [dealAmount, setDealAmount] = useState('100');
  const [serverTax, setServerTax] = useState(27);
  const [serverTotal, setServerTotal] = useState(127);

  // Стейты Фона 5 (Вечевая Палата)
  const [vesselAccessLevel, setAccessLevel] = useState<'OPEN' | 'CLOSED'>('CLOSED');
  const [rebellionPulse, setRebellionPulse] = useState(45);
  const [boiarSignatures, setBoiarSignatures] = useState([true, false, false]);

  // Стейты Фона 6 (Княжеский Двор)
  const [isBlizzardActive, setIsBlizzardActive] = useState(false);
  const [selectedBoiarBuilding, setSelectedBoiarBuilding] = useState<number | null>(null);
  const [boiarEstates, setBoiarBuilding] = useState([
    { id: 1, name: 'Личная Изба Добрыни', owner: 'Добрыня', shape: 'SQUARE', icon: '🏡', activeLock: false, hasDeposit: true },
    { id: 2, name: 'Терем Камерный Радомира', owner: 'Радомир', shape: 'CIRCLE', icon: '🪵', activeLock: false, hasDeposit: true },
    { id: 3, name: 'Кузница-Артель Борислава', owner: 'Борислав', shape: 'SQUARE', icon: '🔨', activeLock: true, hasDeposit: true },
    { id: 4, name: 'Заброшенная Нода Мстислава', owner: 'Мстислав', shape: 'SQUARE', icon: '🪵', activeLock: false, hasDeposit: false }
  ]);

  // Стейты Фона 7 (Мировое Вече)
  const [vecheChin, setVecheChin] = useState<'ПРОХОЖИЙ' | 'БОЯРИН' | 'КУДЕСНИК'>('БОЯРИН');
  const [isArchitectModifier, setIsArchitectModifier] = useState(false);
  const [vecheProposals, setVecheProposals] = useState([
    { id: 1, title: 'Апдейт C++ кода ядра ноды: Ограничение APPLE_TAX до 24%', quorum: 68, votesLubor: 450, votesNelubor: 120, isVetoActive: false },
    { id: 2, title: 'Распределение Общемирового Светового Котла в Пул Валидаторов', quorum: 42, votesLubor: 210, votesNelubor: 190, isVetoActive: false }
  ]);

  // ================= ФОН 8: СУВЕРЕННЫЕ СТЕЙТЫ ТОРГОВОГО ВЫРИЯ =================
  const [vyriyOrders, setVyriyOrders] = useState([
    { id: 1, rate: '1 YNT = 5 Лучей', type: 'ПРОДАЖА', amount: '15 YNT', creator: 'Боярин Ипатий' },
    { id: 2, rate: '1 YNT = 4.8 Луча', type: 'ПОКУПКА', amount: '40 YNT', creator: 'Купец Твердислав' }
  ]);

  // Стейты Фона 9 (Оракул Бабы Яги)
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<number>(0);
  const [vechePassphrase, setVechePassphrase] = useState('');
  const [isYagaUnlocked, setIsYagaUnlocked] = useState(false);
  const [isSpringFlowing, setIsSpringFlowing] = useState(false);

  const [inputText, setInputText] = useState('');

  // ИСТИННАЯ ПОЛНАЯ МАТРИЦА 8 ФОНОВ (Фон 8 Торговый Вырий ВОЗВРАЩЕН В СТРОЙ!)
  const chatDatabase = [
    { id: 1, name: 'Родовая Поляна Чертога', type: 'Главный Экран', chatId: 'chertog_meadow_main', icon: '🌳', status: 'в сети' },
    { id: 2, name: 'Изба (Приватный чат)', type: 'Семейный Круг', chatId: 'izba_private_chat', icon: '🏡', status: 'в сети' },
    { id: 3, name: 'Простой Терем', type: 'Камерное Сообщество', chatId: 'prostoy_terem_community', icon: '🪵', status: 'был в сети 27 мин назад' },
    { id: 4, name: 'Терем-Артель', type: 'Рабочая Мастерская', chatId: 'terem_artel_workshop', icon: '🔨', status: 'кипит световой бартер' },
    { id: 5, name: 'Вечевая Палата', type: 'Локальный Форум', chatId: 'veche_palata_forum', icon: '🏛️', status: 'Бояре на помосте' },
    { id: 6, name: 'Княжеский Двор', type: 'Супер-Сообщество', chatId: 'kniaz_dvor_super_community', icon: '👑', status: 'лазерные межи портов' },
    { id: 7, name: 'Глобальное Вече Царства', type: 'Главная Площадь', chatId: 'global_veche_square', icon: '🔔', status: 'ситуационный крио-центр' },
    { id: 8, name: 'Торговый Вырий', type: 'Глобальная Ярмарка', chatId: 'torgoviy_vyriy_market', icon: '💎', status: 'P2P-торги открыты' },
    { id: 9, name: 'Оракул Бабы Яги', type: 'Берёзовый Родник', chatId: 'yaga_oracle_node', icon: '🧪', status: 'квантовый шлюз памяти' }
  ];

  // Массив переписок берестяной почты
  const [mailRepository, setMailRepository] = useState<{ [key: string]: Array<{ id: number; sender: string; text: string; time: string; isMe: boolean; tag: string }> }>({
    'chertog_meadow_main': [{ id: 101, sender: 'Ведун', text: 'Добро пожаловать на Родовую Поляну.', time: '08:00', isMe: false, tag: 'SYSTEM' }],
    'izba_private_chat': [{ id: 201, sender: 'Ладослава', text: 'Добро войти в наш семейный Круг, соратник! Ключ Ed25519 взведён ладно.', time: '12:34', isMe: false, tag: 'CHAT' }],
    'prostoy_terem_community': [{ id: 301, sender: 'Семейный Хранитель', text: '📜 Горница защищена Коном Семейного Хранителя.', time: '14:20', isMe: false, tag: 'CHRONICLES' }],
    'terem_artel_workshop': [{ id: 401, sender: 'Мастер Ратибор', text: '🔨 Лоза Артели проросла сочно.', time: '10:15', isMe: false, tag: 'SYSTEM' }],
    'veche_palata_forum': [{ id: 501, sender: 'Дворецкий Места', text: '🗝️ Сбор взносов в Пул Игрищ открыт.', time: '11:02', isMe: false, tag: 'SYSTEM' }],
    'kniaz_dvor_super_community': [{ id: 601, sender: 'Елена Премудрая', text: '📖 Все лазерные линии связи активны.', time: '16:00', isMe: false, tag: 'SYSTEM' }],
    'global_veche_square': [{ id: 701, sender: 'Елена Премудрая', text: '📖 Открываю Всемирный Сход Глобального Блокчейн-Парламента.', time: '17:00', isMe: false, tag: 'SYSTEM' }],
    'torgoviy_vyriy_market': [
      { id: 801, sender: 'Зодчий Вырия', text: '💎 [Ярмарка] P2P-стаканы ордеров синхронизированы. Налог общины APPLE_TAX учитывается автоматически.', time: '17:40', isMe: false, tag: 'MARKET' },
      { id: 802, sender: 'Вы', text: 'Проверяю выставление суверенных ордеров на обмен Лучиков на Янтарь YNT.', time: '17:42', isMe: true, tag: 'MARKET' }
    ],
    'yaga_oracle_node': [{ id: 901, sender: 'Оракул Яги', text: '🧪 Квантовые шлюзы глубокой очистки памяти PocketDb взведены.', time: '18:00', isMe: false, tag: 'SYSTEM' }]
  });

  const getChatKeyById = (id: number) => {
    const found = chatDatabase.find(c => c.id === id);
    return found ? found.chatId : 'izba_private_chat';
  };

  const currentMessages = mailRepository[getChatKeyById(activeChat)] || [];
  const displayMessages = currentMessages.filter(msg => {
    if (activeChat !== 3) return true;
    if (currentGornitsa === 'ALL') return true;
    return msg.tag === currentGornitsa;
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const currentKey = getChatKeyById(activeChat);
    const newMsg = {
      id: Date.now(),
      sender: 'Вы',
      text: isDosAttack && activeChat === 3 ? 'Ква-ква! 🐸' : inputText,
      time: '19:00',
      isMe: true,
      tag: activeChat === 3 ? currentGornitsa : 'CHAT'
    };
    
    bridge.broadcastTelegramToBlockchain({ chatId: currentKey, user: 'Вы', text: inputText });
    setMailRepository({ ...mailRepository, [currentKey]: [...(mailRepository[currentKey] || []), newMsg] });
    setInputText('');
  };

  const handleToggleBuildingLock = (id: number) => {
    setBoiarBuilding(prev => prev.map(b => b.id === id ? { ...b, activeLock: !b.activeLock } : b));
  };

  const handleVecheVote = async (proposalId: number, type: 'LUBO' | 'NELUBO') => {
    // Вытаскиваем текущее число Искорок Зари из баланса
    const [currentRays, maxRays] = balances.rayLight.split(' / ').map(Number);
    if (currentRays < 1 && type === 'LUBO') {
      alert("Отлуп Вече: Твои Искорки Зари угасли! Жди нового Рассвета.");
      return;
    }

    const calculatedWeight = await bridge.calculateVecheVoteWeight(vecheChin, isArchitectModifier);
    const newRays = type === 'LUBO' ? currentRays - 1 : currentRays;

    setBalances(prev => ({ ...prev, rayLight: `${newRays} / ${maxRays}` }));

    setVecheProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        if (type === 'LUBO') {
          return { ...p, votesLubor: p.votesLubor + calculatedWeight, quorum: Math.min(p.quorum + 2, 100) };
        } else {
          return { ...p, votesNelubor: p.votesNelubor + calculatedWeight, isVetoActive: true };
        }
      }
      return p;
    }));
    
    alert(`🟢 Кон принят! Твой Чин весит ${calculatedWeight} Лучей. Искорка запечена на порту 8028.`);
  };

  const handleBirchSpringFlow = async () => {
    if (balances.yntPersonal < 1) {
      alert("Отлуп ядра: Недостаточно Янтаря для активации Оракула!");
      return;
    }
    setIsSpringFlowing(true);
    
    // Вычисляем новый баланс Ларца
    const newYntPersonal = balances.yntPersonal - 1;
    
    // Физически запекаем и сохраняем новый баланс на жесткий диск ноутбука!
    localStorage.setItem('beresta_ynt_personal', newYntPersonal.toString());
    setBalances(prev => ({ ...prev, yntPersonal: newYntPersonal }));

    setTimeout(() => {
      setIsSpringFlowing(false);
      setIsYagaUnlocked(true);
      alert("✨ Хрустальный звон: 1 YNT безвозвратно сожжен в пассивный пул! Скрытый токен Яги разблокирован!");
    }, 2000);
  };

  React.useEffect(() => {
    const updateTax = async () => {
      const res = await bridge.calculateAppleTaxRpc(dealAmount);
      if (res.success) {
        setServerTax(res.appleTax);
        setServerTotal(res.totalWithTax);
      }
    };
    updateTax();
  }, [dealAmount]);

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
              <span className="text-sm font-mono font-medium text-emerald-400">🪞 {balances.yntPersonal.toFixed(2)}</span>
            </div>
            <div className="w-px h-4 bg-slate-700/60"></div>
            <div className="text-center">
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Ларец Места</span>
              <span className="text-sm font-mono font-medium text-slate-200">🪵 {balances.yntDeposit.toFixed(2)}</span>
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
        
        {/* ЛЕВАЯ ПАНЕЛЬ: Список чатов Портала с интерактивным поиском */}
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

          {activeChat === 3 && (
            <button onClick={() => setCurrentGornitsa('ALL')} className="w-full py-2 px-3 rounded-xl border border-amber-900/40 bg-amber-950/20 text-slate-400 font-mono font-bold text-center text-xs transition-all shrink-0 cursor-pointer">📢 Вечевой Набат</button>
          )}

          {activeChat === 5 && (
            <div className="w-full p-1.5 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-1 shrink-0 text-center select-none font-mono">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Допуск Управления Палатой</span>
              <button onClick={() => setAccessLevel(vesselAccessLevel === 'OPEN' ? 'CLOSED' : 'OPEN')} className={`w-full py-1 rounded-lg text-[10px] border transition-all ${vesselAccessLevel === 'CLOSED' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                {vesselAccessLevel === 'CLOSED' ? '🔒 Закрытая Палата (Терем)' : '🍃 Открытая Поляна'}
              </button>
            </div>
          )}

          {activeChat === 6 && (
            <div className="w-full p-1.5 bg-black/20 rounded-xl border border-slate-800 flex flex-col gap-1 shrink-0 text-center select-none font-mono">
              <span className="text-[8px] text-neutral-500 uppercase font-bold">Метео-Шлюз Живой Погоды</span>
              <button onClick={() => setIsBlizzardActive(!isBlizzardActive)} className={`w-full py-1 rounded-lg text-[10px] border transition-all cursor-pointer ${isBlizzardActive ? 'bg-sky-950 border-sky-500 text-sky-400 font-bold animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                {isBlizzardActive ? '❄️ Ледяная Пурга (DoS)' : '☀️ Ясная Погода'}
              </button>
            </div>
          )}

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
                onClick={() => setActiveChat(chat.id)}
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

        {/* ПРАВАЯ ПАНЕЛЬ С СЕГМЕНТАЦИЕЙ ПОДКЛЮЧЕНИЙ */}
        <div className={`flex-1 border border-slate-700/40 rounded-2xl flex flex-col overflow-hidden shadow-xl relative transition-all duration-500
          ${activeChat === 7 ? 'bg-gradient-to-b from-[#0b101d] to-[#080a12] border-cyan-900/40' : 'bg-[#1e2326]/60'}
          ${activeChat === 5 && vesselAccessLevel === 'CLOSED' ? 'bg-[#221e1a]/80 border-amber-900/40' : ''}
          ${activeChat === 6 && isBlizzardActive ? 'bg-[#0f1522]/90 border-sky-800/40' : ''}
          ${activeChat === 8 ? 'bg-gradient-to-b from-[#1c1810] to-[#0f0d09] border-amber-900/30' : ''}
          ${activeChat === 9 ? 'bg-gradient-to-b from-[#111116] to-[#07090d] border-emerald-900/30' : ''}`}>
          
          {activeChat === 6 && isBlizzardActive && (
            <div className="absolute inset-0 bg-sky-400/5 pointer-events-none z-30 animate-pulse backdrop-blur-[1px] flex items-center justify-center font-mono text-[10px] text-sky-400 uppercase tracking-widest select-none">❄️ [ВЗВЕДЁН ЗАТВОР ЭКСТРЕМАЛЬНОЙ ПОГОДЫ — ЛЕДЯНАЯ ПУРГА] ❄️</div>
          )}

          {/* Шапка сообщений */}
          <div className="p-3 border-b border-slate-700/40 bg-black/10 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#161a1d] border border-slate-700/50 flex items-center justify-center text-sm shadow-sm">
                {chatDatabase.find(c => c.id === activeChat)?.icon || '🏡'}
              </div>
              <div className="leading-tight">
                <h3 className="text-xs font-semibold text-slate-200">{chatDatabase.find(c => c.id === activeChat)?.name}</h3>
                <span className="text-[10px] font-mono font-medium text-emerald-400 block mt-0.5 animate-pulse">
                  ● {activeChat === 7 ? `весовое плечо голоса активно` : activeChat === 6 && isBlizzardActive ? 'пурга на портах 8027/8028' : chatDatabase.find(c => c.id === activeChat)?.status}
                </span>
              </div>
            </div>

            {/* ИИ АГЕНТЫ В ШАПКЕ ЧАТА */}
            <div className="flex items-center gap-2 pr-2 select-none">
              {activeChat === 3 && <div className="text-xl animate-bounce" title="ИИ-Скоморох 🤪">🤪</div>}
              {activeChat === 5 && <div className="text-xl animate-bounce" title="ИИ-Дворецкий Места 🕵️‍♂️">🕵️‍♂️</div>}
              {activeChat === 6 && <div className="text-xl animate-bounce" title="ИИ-Елена Премудрая 📖">📖</div>}
              {activeChat === 7 && <div className="flex gap-2"><div className="text-xl animate-pulse">📖</div><div className="text-xl animate-bounce">🕵️‍♂️</div></div>}
              {activeChat === 8 && <div className="text-xl animate-pulse" title="ИИ-Зодчий Вырия 💎">💎</div>}
              {activeChat === 9 && <div className="text-xl animate-bounce" title="ИИ-Баба Яга 🧪">🧪</div>}
            </div>

            <span className="text-[9px] font-mono text-neutral-500 px-2 py-0.5 bg-neutral-950/30 rounded-lg">
              id: {chatDatabase.find(c => c.id === activeChat)?.chatId || 'unknown'}
            </span>
          </div>

          {/* ДИНАМИЧЕСКИЕ ПЛАШКИ ФОНОВ 4 И 5 */}
          {activeChat === 4 && (
            <div className="w-full bg-[#161a1d]/60 p-2.5 border-b border-slate-700/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0"><span className="text-lg animate-pulse">🌿</span><div className="leading-tight min-w-0"><span className="text-[10px] text-emerald-400 font-bold block">[Лоза Артели Проросла]</span><span className="text-[8px] text-neutral-500 truncate block">Бартер активен. Залог 40 YNT запечён.</span></div></div>
              <div className="flex items-center gap-2 bg-black/40 border border-slate-800 p-1.5 rounded-xl text-[10px] w-full md:max-w-xs justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-1 text-slate-300"><span>Сумма:</span><input type="number" value={dealAmount} onChange={(e) => setDealAmount(e.target.value)} className="w-12 bg-transparent border-b border-slate-700 text-emerald-400 focus:outline-none text-center font-bold font-mono" /></div>
                  <span className="text-[8px] text-amber-500 font-bold">🍎 Tax 27%: +{serverTax} YNT</span>
                </div>
                <div className="w-px h-6 bg-slate-800"></div>
                <div className="text-right leading-tight">
                  <span className="text-[7.5px] text-neutral-500 block uppercase">Выход в Пул</span>
                  <span className="text-xs font-bold text-slate-200">{serverTotal} YNT</span>
                </div>
                <button 
                  onClick={() => {
                    if (balances.yntPersonal < serverTotal) {
                      alert("Отлуп ядра: Недостаточно Янтаря для оплаты сделки в Артели!");
                      return;
                    }
                    const updatedYnt = balances.yntPersonal - serverTotal;
                    localStorage.setItem('beresta_ynt_personal', updatedYnt.toString());
                    setBalances(prev => ({ ...prev, yntPersonal: updatedYnt }));
                    alert(`💸 Успех! Списано ${serverTotal} YNT (Налог ${serverTax} YNT учтён). Блок запечён в RPC 8028.`);
                  }} 
                  className="px-2.5 py-1 bg-emerald-750 text-white text-[9px] font-bold rounded-lg cursor-pointer hover:bg-emerald-600 transition-all"
                >
                  💸 Оплатить
                </button>
              </div>
            </div>
          )}

          {activeChat === 5 && vesselAccessLevel === 'CLOSED' && (
            <div className="w-full bg-amber-950/20 p-2.5 border-b border-amber-900/30 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 font-mono select-none animate-fadeIn">
              <div className="w-full md:max-w-xs space-y-1"><div className="flex justify-between text-[8px] font-bold text-amber-500 uppercase"><span>⚡ Вечевой Пульс Бунта против Управляющего</span><span>{rebellionPulse}%</span></div><div className="w-full bg-black/40 border border-slate-800 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-600 to-red-600" style={{ width: `${rebellionPulse}%` }}></div></div></div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-neutral-500 uppercase font-bold">Вето Бояр:</span>
                <div className="flex gap-1">
                  {boiarSignatures.map((signed, idx) => (
                    <button key={idx} onClick={() => { const updated = [...boiarSignatures]; updated[idx] = !updated[idx]; setBoiarSignatures(updated); setRebellionPulse(updated.filter(Boolean).length * 25 + 20); }} className={`w-5 h-5 rounded border text-[8px] font-bold flex items-center justify-center cursor-pointer ${signed ? 'bg-red-900/40 border-red-500 text-red-400 shadow-inner' : 'bg-slate-900 border-slate-800 text-neutral-600'}`}>{signed ? '🔒' : '✍️'}</button>
                  ))}
                </div>
                {rebellionPulse >= 70 && <span className="text-[8px] font-bold bg-red-900/60 border border-red-500 px-1.5 py-0.5 rounded text-red-400 animate-pulse uppercase">Блокирован!</span>}
              </div>
            </div>
          )}

          {/* ИНТЕРФЕЙС ГОРНИЦ ДЛЯ ФОНА 3 */}
          {activeChat === 3 && (
            <div className="w-full bg-black/10 p-2 border-b border-slate-700/20 flex flex-row items-center gap-3 justify-center shrink-0 overflow-x-auto scrollbar-none select-none">
              <button onClick={() => setCurrentGornitsa('BARTER')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer shadow-sm ${currentGornitsa === 'BARTER' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>🌾 Горница Бартера</button>
              <button onClick={() => setCurrentGornitsa('CENZ')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer shadow-sm ${currentGornitsa === 'CENZ' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>🛡️ Горница Ценза</button>
              <button onClick={() => setCurrentGornitsa('CHRONICLES')} className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border transition-all cursor-pointer shadow-sm ${currentGornitsa === 'CHRONICLES' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 font-bold' : 'bg-[#161a1d]/60 border-slate-800 text-slate-400'}`}>📜 Горница Летописей</button>
            </div>
          )}

          {/* ИНТЕРФЕЙС ГЕНЕРАЛЬНОГО ПЛАНА ДЛЯ ФОНА 6 */}
          {activeChat === 6 && (
            <div className="w-full p-3 bg-black/20 border-b border-slate-700/20 flex flex-col gap-2 shrink-0 font-mono select-none animate-fadeIn">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block text-center">[🗺️ Интерактивный Генеральный План Владений Бояр]</span>
              <div className="grid grid-cols-4 gap-2.5 w-full">
                {boiarEstates.map((estate) => (
                  <button
                    key={estate.id}
                    onClick={() => {
                      setSelectedBoiarBuilding(estate.id);
                      handleToggleBuildingLock(estate.id);
                    }}
                    className={`p-2 border flex flex-col items-center justify-center gap-1 transition-all relative text-center group cursor-pointer
                      ${estate.shape === 'CIRCLE' ? 'rounded-full w-20 h-24 mx-auto' : 'rounded-xl'}
                      ${!estate.hasDeposit ? 'bg-slate-950/80 border-slate-900 text-neutral-600 grayscale contrast-75 brightness-75' : 'bg-[#161a1d]/80 border-slate-800 text-slate-300 hover:border-slate-500'}
                      ${estate.activeLock ? 'border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]' : ''}`}
                    title={!estate.hasDeposit ? `${estate.name} — Залог пуст!` : `${estate.name} — Хозяин: ${estate.owner}`}
                  >
                    {!estate.hasDeposit && <span className="absolute bottom-1 text-[7.5px] text-emerald-700/80 font-bold block animate-pulse uppercase tracking-tight">🌿 мох</span>}
                    <span className="text-base">{estate.icon}</span>
                    <span className="text-[8.5px] block truncate w-full px-0.5">{estate.owner}</span>
                    <span className="text-[7px] text-neutral-500 block leading-none font-mono">{estate.activeLock ? '🔒 Закр.' : '🍃 Откр.'}</span>
                    <span className={`absolute top-1 right-1 w-1 h-1 rounded-full ${estate.hasDeposit ? 'bg-cyan-400' : 'bg-red-500'}`}></span>
                  </button>
                ))}
              </div>
              {selectedBoiarBuilding && <div className="p-2 bg-black/40 border border-slate-800 rounded-xl text-[10px] text-center text-slate-300 animate-fadeIn font-mono">🔮 Изменена суверенная межа владения №{selectedBoiarBuilding}.</div>}
            </div>
          )}

          {/* ИНТЕРФЕЙС ИГРОВОГО СХОДА ДЛЯ ФОНА 7 */}
          {activeChat === 7 && (
            <div className="w-full p-3 bg-black/20 border-b border-slate-700/20 flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[160px] scrollbar-none animate-fadeIn font-mono select-none">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block text-center">[🏛️ Вечевой Помост Свитков Мировых Вопросов]</span>
              <div className="space-y-3 w-full">
                {vecheProposals.map((prop) => (
                  <div key={prop.id} className={`p-2 bg-black/40 border border-slate-800/80 rounded-xl flex flex-col gap-2 transition-all relative ${prop.isVetoActive ? 'border-red-600/50 bg-red-950/10' : ''}`}>
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-[11px] font-semibold text-slate-200 leading-tight">{prop.title}</h4>
                      <span className="text-xs font-bold text-cyan-400">{prop.quorum}%</span>
                    </div>
                    <div className="flex gap-2 justify-between items-center pt-1 border-t border-slate-900/40 text-[9px]">
                      <div className="flex gap-3 text-slate-400">
                        <span>🟢 Любо: <b className="text-emerald-400">{prop.votesLubor}</b></span>
                        <span>🔴 Нелюбо: <b className="text-red-400">{prop.votesNelubor}</b></span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleVecheVote(prop.id, 'LUBO')} className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-700/50 text-emerald-400 font-bold rounded text-[8px] cursor-pointer">🟢 Любо</button>
                        <button onClick={() => handleVecheVote(prop.id, 'NELUBO')} className={`px-2 py-0.5 border rounded text-[8px] font-black cursor-pointer ${prop.isVetoActive ? 'bg-red-950 border-red-500 text-red-400 animate-bounce' : 'bg-red-950/40 border-red-900 text-red-400'}`}>🔴 Нелюбо</button>
                      </div>
                    </div>
                    {prop.isVetoActive && <div className="text-[7.5px] font-bold text-red-400 text-center pt-1 animate-pulse uppercase">⚠️ Вето Зарока Вепря! Требуется P2P-заморозка 40 YNT!</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ИНТЕРФЕЙС ИГРОВОГО СХОДА ДЛЯ ФОНА 8 (ТОРГОВЫЙ ВЫРИЙ) */}
          {activeChat === 8 && (
            <div className="w-full p-3 bg-black/20 border-b border-slate-700/20 flex flex-col gap-2 shrink-0 font-mono select-none animate-fadeIn">
              <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider block text-center">[💎 P2P-Стаканы Суверенных Ордеров Ярмарки]</span>
              <div className="space-y-1.5 w-full text-[10px]">
                {vyriyOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center bg-black/40 border border-slate-850 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${order.type === 'ПРОДАЖА' ? 'bg-red-950 text-red-400 border border-red-900/50' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/50'}`}>{order.type}</span>
                      <span className="text-slate-300 font-medium">{order.rate}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-200 block font-bold">{order.amount}</span>
                      <span className="text-[8px] text-neutral-500 block">От: {order.creator}</span>
                    </div>
                    <button onClick={() => alert(`Запрос к Вырию отправлен. Сделка на ${order.amount} уходит в P2P-очередь.`)} className="px-2 py-1 bg-amber-700 text-white font-bold text-[8px] rounded transition-all active:scale-95 cursor-pointer shadow-sm">Обменять</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ИНТЕРФЕЙС ДЛЯ ФОНА 9 (Оракул Бабы Яги) */}
          {activeChat === 9 && (
            <div className="w-full p-3 bg-black/20 border-b border-slate-700/20 flex flex-col gap-2 shrink-0 font-mono select-none animate-fadeIn relative">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block text-center">[🧪 Крио-Центр Оракула Бабы Яги]</span>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={() => { setShowResetModal(true); setResetStep(1); }} className="p-2.5 bg-black/40 border border-slate-800 rounded-xl hover:border-emerald-500/40 transition-all flex flex-col items-center justify-center gap-1 text-center h-20 cursor-pointer">
                  <span className="text-2xl animate-pulse">🏡</span>
                  <span className="text-[9px] text-slate-200 block font-bold">Избушка Яги</span>
                </button>
                <button onClick={handleBirchSpringFlow} disabled={isSpringFlowing} className={`p-2.5 bg-black/40 border rounded-xl transition-all flex flex-col items-center justify-center gap-1 text-center h-20 cursor-pointer ${isSpringFlowing ? 'border-cyan-500' : 'border-slate-800'} ${isYagaUnlocked ? 'border-emerald-500/30' : ''}`}>
                  <span className="text-2xl">{isSpringFlowing ? '🌊' : '🪵💧'}</span>
                  <span className="text-[9px] text-cyan-400 block font-bold">{isYagaUnlocked ? 'Анлок Яги ✓' : 'Сжечь 1 YNT'}</span>
                </button>
              </div>

              {showResetModal && (
                <div className="absolute inset-x-2 top-2 bg-[#161a1d]/95 border border-slate-800 p-3 rounded-xl space-y-2 z-40 shadow-2xl animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                    <span className="text-[9px] font-bold text-emerald-400">🛠️ Пульт Reset (ИИ-Оптимизатор Медведь)</span>
                    <button onClick={() => { setShowResetModal(false); setResetStep(0); }} className="text-neutral-500 text-xs">✕</button>
                  </div>
                  {resetStep === 1 && (
                    <div className="space-y-1.5">
                      <p className="text-[8.5px] text-slate-300">Шаг 1. <b>[🍃 Очистить Оперение сокола]</b> — Стирание медиа-кэша без потери Ключа.</p>
                      <button onClick={() => setResetStep(2)} className="w-full py-1 bg-emerald-800 text-white font-bold text-[9px] rounded cursor-pointer">Выполнить Стирание Кэша</button>
                    </div>
                  )}
                  {resetStep === 2 && (
                    <div className="space-y-1.5">
                      <p className="text-[8.5px] text-slate-300">Шаг 2. <b>[🌾 Переплавить Цепи портов]</b> — Перезапуск сокет-соединений по портам 8027/8028.</p>
                      <button onClick={() => setResetStep(3)} className="w-full py-1 bg-cyan-800 text-white font-bold text-[9px] rounded cursor-pointer">Перезапустить P2P Сокеты</button>
                    </div>
                  )}
                  {resetStep === 3 && (
                    <div className="space-y-1.5">
                      <p className="text-[8.5px] text-red-400 font-bold">Шаг 3. ⚠️ [🔥 Сжечь Морок] — Удаление базы данных PocketDb. Введи 'генезис'.</p>
                      <input type="text" placeholder="Введите фразу Оберега..." value={vechePassphrase} onChange={(e) => setVechePassphrase(e.target.value)} className="w-full bg-black border border-slate-800 rounded px-2 py-0.5 text-[9px] text-amber-400 focus:outline-none" />
                      <button onClick={() => { if(vechePassphrase.toLowerCase()==='генезис'){ alert("💥 PocketDb стёрта."); setShowResetModal(false); setResetStep(0); setVechePassphrase(''); }else{ alert("Неверно!"); } }} className="w-full py-1 bg-gradient-to-r from-red-700 to-amber-700 text-white font-black text-[9px] rounded cursor-pointer">🔥 Ипепелить Базу</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Лента сообщений чата */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none flex flex-col justify-end bg-black/5">
            {displayMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[70%] leading-snug animate-fadeIn ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                {!msg.isMe && <span className="text-[9px] font-semibold text-emerald-400 mb-0.5 ml-1 font-mono">{msg.sender}</span>}
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