import React, { useState } from 'react';

// [UI_Vessel_Izba_Core] + [UI_Chests_View_Core]
// Изба (Фон 2) — Двухпанельный хай-тек мессенджер Синего Вестника с интерактивным P2P-поиском
export default function IzbaComponent() {
  // 7 Истинных Балансов Казны (Укрупнённый text-sm контур)
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

  // Интерактивное состояние P2P поиска по именам и ID локаций
  const [searchQuery, setSearchText] = useState('');

  // Валидированная Матрица Фонов Портала по ТЗ
  const chatDatabase = [
    { id: 1, name: 'Родовая Поляна Чертога', type: 'Главный Экран', chatId: 'chertog_meadow_main', icon: '🌳', unread: 0, status: 'в сети' },
    { id: 2, name: 'Изба (Приватный чат)', type: 'Семейный Круг', chatId: 'izba_private_chat', icon: '🏡', unread: 0, status: 'в сети' },
    { id: 3, name: 'Простой Терем', type: 'Камерное Сообщество', chatId: 'prostoy_terem_community', icon: '🪵', unread: 3, status: 'был в сети 27 мин назад' },
    { id: 4, name: 'Терем-Артель', type: 'Рабочая Мастерская', chatId: 'terem_artel_workshop', icon: '🔨', unread: 12, status: 'в сети' },
    { id: 5, name: 'Вечевая Палата', type: 'Локальный Форум', chatId: 'veche_palata_forum', icon: '🏛️', unread: 7, status: 'онлайн-вече' },
    { id: 6, name: 'Княжеский Двор', type: 'Супер-Сообщество', chatId: 'kniaz_dvor_super_community', icon: '👑', unread: 0, status: 'был в сети вчера' },
    { id: 7, name: 'Глобальное Вече Царства', type: 'Главная Площадь', chatId: 'global_veche_square', icon: '🔔', unread: 42, status: '950 Бояр на помосте' },
    { id: 8, name: 'Торговый Вырий', type: 'Глобальная Ярмарка', chatId: 'torgoviy_vyriy_market', icon: '💎', unread: 1, status: 'P2P-торги открыты' }
  ];

  const [activeChat, setActiveChat] = useState(2); // Изба активна по умолчанию
  const [inputText, setInputText] = useState('');

  // База данных Берестяной Почты: Уникальные ЛОРные переписки под каждую комнату Портала
  const [mailRepository, setMailRepository] = useState<{ [key: number]: Array<{ id: number; sender: string; text: string; time: string; isMe: boolean }> }>({
    1: [
      { id: 101, sender: 'Ведун', text: 'Добро пожаловать на твою Родовую Поляну. Древо Чертога пустило глубокие корни в блокчейн.', time: '08:00', isMe: false }
    ],
    2: [
      { id: 201, sender: 'Ладослава', text: 'Добро войти в наш семейный Круг, соратник! Ключ Ed25519 взведён ладно.', time: '12:34', isMe: false },
      { id: 202, sender: 'Вы', text: 'Здравствуй! Думы пишутся на бересте чисто. Проверяю сокет-мост.', time: '12:36', isMe: true }
    ],
    3: [
      { id: 301, sender: 'Хранитель Терема', text: 'Камерный круг в сборе. Лимит в 27 участников не превышен, чужаков в ноде нет.', time: '15:20', isMe: false }
    ],
    4: [
      { id: 401, sender: 'Мастер Ратибор', text: 'Чертежи инди-ремесла для Ступени 2 готовы. Проверяем смарт-контракты.', time: '10:15', isMe: false }
    ],
    5: [
      { id: 501, sender: 'Старейшина', text: 'Локальный спор объявляю открытым! Активируйте Зеркальца для фиксации дум.', time: '17:40', isMe: false }
    ],
    6: [
      { id: 601, sender: 'Князь', text: 'Артель и Палата успешно объединены в супер-сообщество. Владения под защитой.', time: 'Вчера', isMe: false }
    ],
    7: [
      { id: 701, sender: 'Смарт-Контракт Вече', text: 'Голосование за изменение Конов запущено. Результаты будут запечены на Закате.', time: '19:00', isMe: false }
    ],
    8: [
      { id: 801, sender: 'Лавка Ремесла', text: 'Выставлен новый ордер на обмен Лучиков на Янтарь YNT. Комиссия APPLE_TAX учтена.', time: '19:42', isMe: false }
    ]
  });

  const currentMessages = mailRepository[activeChat] || [];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Вы',
      text: inputText,
      time: '19:50',
      isMe: true
    };
    setMailRepository({
      ...mailRepository,
      [activeChat]: [...currentMessages, newMsg]
    });
    setInputText('');
  };

  // Живая P2P-фильтрация списка чатов на основе ввода в поле поиска
  const filteredChats = chatDatabase.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.chatId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col justify-between font-sans antialiased text-slate-200">
      
      {/* ВЕРХНИЙ СЛОЙ: Тонкая и сжатая на 20% плашка 7 Балансов (max-w-[1152px]) */}
      <div className="w-full max-w-[1152px] mx-auto bg-gradient-to-r from-emerald-800/40 to-slate-800/70 border border-slate-700/40 rounded-xl p-1.5 pr-4 pb-2.5 pt-2.5 mb-4 shadow-xl relative shrink-0">
        <div className="flex flex-row items-center gap-2.5 overflow-x-auto scrollbar-none justify-between w-full">
          
          {/* Ларцы */}
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

          {/* Живое Время */}
          <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-2.5 py-0.5 rounded-lg text-center">
            <div>
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Искорки Зари</span>
              <span className="text-sm font-mono font-medium text-cyan-400">🌅 {balances.rayLight}</span>
            </div>
          </div>

          {/* Тропы Богов */}
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

          {/* Вечевой Затвор */}
          <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-2.5 py-0.5 rounded-lg text-center">
            <div>
              <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Вечевой Залог</span>
              <span className="text-sm font-mono font-medium text-emerald-500">🔒 {balances.vecheLock}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ГЛАВНЫЙ ДВУХПАНЕЛЬНЫЙ ДИЗАЙН МЕССЕНДЖЕРА (Синий Вестник) */}
      <div className="flex-1 flex flex-row w-full max-w-[1152px] mx-auto gap-4 items-stretch overflow-hidden h-[calc(100vh-140px)]">
        
        {/* ЛЕВАЯ ПАНЕЛЬ: Интерактивный Поиск и Список чатов */}
        <div className="w-[320px] shrink-0 bg-[#1e2326]/60 border border-slate-700/40 rounded-2xl p-3 flex flex-col gap-2 overflow-hidden shadow-md">
          
          {/* Интерактивная строка поиска контактов/чатов */}
          <div className="w-full relative shrink-0">
            <input 
              type="text"
              placeholder="🔍 Найти Избу или Терем по ID..."
              value={searchQuery}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-[#161a1d]/80 border border-slate-700/40 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-200 placeholder-neutral-500 focus:border-emerald-500/40 focus:outline-none transition-all shadow-inner font-mono"
            />
            <span className="absolute left-2.5 top-2 text-xs opacity-40 select-none"></span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-0.5 mt-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
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
            {filteredChats.length === 0 && (
              <div className="text-center text-[11px] text-neutral-600 font-mono py-8 italic select-none">
                Чертоги не найдены... 🪵
              </div>
            )}
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: Окно активной переписки с Берестяной Почтой */}
        <div className="flex-1 bg-[#1e2326]/60 border border-slate-700/40 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          
          {/* ИНДИКАТОР СТАТУСА СЕТИ В ШАПКЕ ЧАТА (Строка «в сети» и т.д. буква в букву) */}
          <div className="p-3 border-b border-slate-700/40 bg-black/10 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#161a1d] border border-slate-700/50 flex items-center justify-center text-sm shadow-sm">
                {chatDatabase[activeChat - 1].icon}
              </div>
              <div className="leading-tight">
                <h3 className="text-xs font-semibold text-slate-200">{chatDatabase[activeChat - 1].name}</h3>
                <span className="text-[10px] font-mono font-medium text-emerald-400 block mt-0.5 animate-pulse">
                  ● {chatDatabase[activeChat - 1].status}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-neutral-500 px-2 py-0.5 bg-neutral-950/30 rounded-lg select-all">
              id: {chatDatabase[activeChat - 1].chatId}
            </span>
          </div>

          {/* Зона летящих сообщений чата */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none flex flex-col justify-end bg-black/5">
            {currentMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[70%] leading-snug animate-fadeIn
                  ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}
              >
                {!msg.isMe && (
                  <span className="text-[9px] font-semibold text-emerald-400 mb-0.5 ml-1 font-mono">{msg.sender}</span>
                )}
                <div 
                  className={`p-2.5 rounded-2xl border text-xs shadow-md break-words relative group
                    ${msg.isMe 
                      ? 'bg-gradient-to-r from-emerald-900/50 to-emerald-950/50 border-emerald-800/30 text-slate-100 rounded-br-sm' 
                      : 'bg-[#161a1d]/80 border-slate-800/60 text-slate-200 rounded-bl-sm'}`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[8px] font-mono text-neutral-500 leading-none">
                    <span>{msg.time}</span>
                    {msg.isMe && (
                      <span className="text-emerald-400 font-bold tracking-tighter" title="Прочитано">✓✓</span>
                    )}
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
              className="flex-1 bg-[#161a1d]/60 border border-slate-700/40 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-neutral-500 focus:border-emerald-500/40 focus:outline-none transition-all shadow-inner font-mono"
            />
            <button 
              onClick={handleSendMessage}
              className="px-4 py-2.5 bg-[#047857]/90 text-slate-200 border border-emerald-800/30 font-semibold rounded-xl text-xs hover:bg-[#065f46] hover:text-white transition-all active:scale-95 shadow-md cursor-pointer"
            >
              Отправить
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}