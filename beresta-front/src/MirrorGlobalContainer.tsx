import React, { useState, useEffect, useRef } from 'react';
import MeadowComponent from './MeadowComponent';

type MirrorState = 'TOKEN' | 'HALF' | 'FULL';

export default function MirrorGlobalContainer() {
  // Слой 0: Активный игровой фон (симуляция Фонов 1-9 по ТЗ)
  const [currentBg, setCurrentBackground] = useState(1);
  const [mirrorState, setMirrorState] = useState<MirrorState>('TOKEN');
  
  // Слой 3: Глобальный контекст диалекта и темы (true = Царство, false = Вестник)
  const [isWitchcraftStyle, setIsWitchcraftStyle] = useState(true);
  
  // Тумблеры Быстрого Пульта (Пол-экрана)
  const [hideTooltips, setHideTooltips] = useState(false);
  const [mirrorQuality, setMirrorQuality] = useState<'light' | 'medium' | 'high'>('medium');
  
  // Суверенное управление ИИ-Мавками (Включается пользователем лично!)
  const [mavkaGovorun, setMavkaGovorun] = useState(true);
  const [mavkaVeschun, setMavkaVeschun] = useState(false);
  const [mavkaBereginya, setMavkaBereginya] = useState(true);
  
  // Тумблеры Протокола "Оберег Взора" [UI_Eye_Shield_Engine]
  const [eyeShieldText, setEyeShieldText] = useState(false);
  const [eyeShieldPrivacy, setEyeShieldPrivacy] = useState(false);
  const [eyeShieldStasis, setEyeShieldStasis] = useState(false);

  // Стейт приватности Свитка Славы (1 = Скрытый Клад, 2 = Родовая Гордость, 3 = Слава Вырия)
  const [privacyState, setPrivacyState] = useState<number>(3);

  // Механический селектор Берестяной Почты (1 = Полёт, 2 = Заслон, 3 = Затвор)
  const [falconMailMode, setFalconMailMode] = useState<number>(1);
  
  // Протокол Озорства [Mirror_Idle_Prank]
  const [idleTime, setIdleTime] = useState(0);
  const [prankStyle, setPrankStyle] = useState<'none' | 'rotate' | 'swing'>('none');
  const globalClickRef = useRef<HTMLDivElement>(null);

  // Ссылочные обереги авто-закрытия шторки
  const settingsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeLegend, setActiveLegend] = useState<string | null>(null);

  // 7 Истинных Балансов Казны [UI_Mirror_Balances_Engine]
  const [balances] = useState({
    yntPersonal: '1,250.00',
    yntDeposit: '40.00',
    rayLight: '12 / 24',
    pathVeles: 450,
    pathPerun: 120, // Синяя молния
    pathSvarog: 380,
    vecheLock: 'Взведён'
  });

  const totalGodsRays = balances.pathVeles + balances.pathPerun + balances.pathSvarog;

  // База данных Матрицы 9 Фонов по ТЗ (С чистыми ID и именами)
  const chatDatabase: { [key: number]: { name: string; id: string; desc: string } } = {
    1: { name: 'Родовая Поляна Чертога (Главный Экран)', id: 'chertog_meadow_main', desc: 'Суверенное пространство Странника, Древо, Костёр общения.' },
    2: { name: 'Изба (Приватный чат)', id: 'izba_private_chat', desc: 'Уютная локация для семейного Круга. Лимит до 3 соратников.' },
    3: { name: 'Простой Терем (Камерное Сообщество)', id: 'prostoy_terem_community', desc: 'Закрытый чат для близкого круга. Лимит до 27 участников.' },
    4: { name: 'Терем-Артель (Рабочая Мастерская)', id: 'terem_artel_workshop', desc: 'Публичный/закрытый бизнес-канал вещания мастеров.' },
    5: { name: 'Вечевая Палата (Локальный Форум)', id: 'veche_palata_forum', desc: 'Публичная группа для обсуждений, споров и Игр.' },
    6: { name: 'Княжеский Двор (Супер-Сообщество)', id: 'kniaz_dvor_super_community', desc: 'Объединяет Артель (4) и Палату (5) под управлением Князя.' },
    7: { name: 'Глобальное Вече Царства (Главная Площадь)', id: 'global_veche_square', desc: 'Высший сквозной чат-платформа всего Портала.' },
    8: { name: 'Торговый Вырий (Глобальная Ярмарка)', id: 'torgoviy_vyriy_market', desc: 'Децентрализованный маркетплейс и P2P-биржа.' },
    9: { name: 'Игрища Кудесников (Пул)', id: 'igrischa_kudesnik_pool', desc: 'Активная фаза Янтарного Краудфандинга и Вечевого Пульса.' }
  };

  // Протокол Озорства (секунды для симуляции минут)
  useEffect(() => {
    const interval = setInterval(() => {
      if (mirrorState === 'TOKEN') {
        setIdleTime((prev) => {
          const next = prev + 1;
          if (next >= 27) setPrankStyle('swing');
          else if (next >= 16) setPrankStyle('rotate');
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mirrorState]);

  // Сброс озорства при касании
  const resetIdleTimer = () => {
    setIdleTime(0);
    setPrankStyle('none');
  };

  const handleTokenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetIdleTimer();
    setMirrorState('HALF');
  };

  return (
    <div 
      ref={globalClickRef}
      onClick={resetIdleTimer}
      className={`min-h-screen relative w-full overflow-hidden transition-colors duration-500 ${isWitchcraftStyle ? 'bg-[#111315]' : 'bg-[#0f111a]'}`}
    >
      {/* СЛОЙ 0: Подложка — Активный игровой Фон */}
      <div className={`absolute inset-0 z-0 transition-all duration-300 ${eyeShieldText ? 'grayscale contrast-125' : ''}`}>
        <MeadowComponent />
      </div>

      {/* СЛОЙ 1: Кристальный овальный токен Зеркальца */}
      {mirrorState === 'TOKEN' && (
        <button
          ref={buttonRef}
          onClick={handleTokenClick}
          className={`absolute top-4 right-4 z-40 w-12 h-12 rounded-full border transition-all duration-300 flex items-center justify-center shadow-lg cursor-pointer
            ${isWitchcraftStyle 
              ? 'bg-[#1e2326]/90 border-emerald-600/30 text-emerald-400 shadow-emerald-950/20' 
              : 'bg-[#10121d]/90 border-slate-700/40 text-cyan-400 shadow-slate-950/40'}
            ${prankStyle === 'rotate' ? 'animate-spin duration-[4000ms]' : ''}
            ${prankStyle === 'swing' ? 'animate-bounce' : ''}
          `}
        >
          <span className="text-xl filter drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">🪞</span>
        </button>
      )}
          {/* СЛОЙ 1: БЫСТРЫЙ ПУЛЬТ ОБЕРЕГА ВЗОРА (Стейт: ПОЛ-ЭКРАНА) */}
      {mirrorState === 'HALF' && (
        <div 
          className={`absolute inset-x-0 bottom-0 h-[85vh] z-40 border-t transition-all duration-300 animate-slideUp shadow-2xl flex flex-col justify-between p-4 md:p-6 md:max-w-2xl md:mx-auto md:rounded-t-2xl overflow-y-auto scrollbar-none
            ${isWitchcraftStyle ? 'bg-[#1a1f22]/95 border-emerald-800/30' : 'bg-[#0b0d16]/95 border-slate-800/50'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Хедер шторки свайпа */}
          <div className="w-full flex flex-col items-center cursor-pointer shrink-0" onClick={() => setMirrorState('FULL')}>
            <div className="w-12 h-1 bg-slate-700 rounded-full mb-1"></div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Свайп вверх — Летопись Рода</span>
          </div>

          {/* Всплывающие укрупнённые подсказки Ведуна по знакам ❓ */}
          {!hideTooltips && (
            <div className="text-center bg-[#161a1d]/60 border border-slate-700/30 rounded-xl p-2 mx-auto max-w-sm text-[11px] text-slate-400 animate-fadeIn shadow-sm w-full mt-1.5">
              💡 Переключайте режимы Вестника, активируйте ИИ-Мавок или управляйте вещами Инвентаря.
            </div>
          )}

          {/* ПАНЕЛЬ ВЕСТНИКА: Панель Трёх Кнопок-Иконок Интеграции Telegram [Mirror_TG_Integration_Gate] */}
          <div className="w-full max-w-md mx-auto bg-black/20 border border-slate-800/40 rounded-xl p-2 flex flex-col gap-1.5 mt-2">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider text-center block">[Панель Вестника] — Шлюз TDLib</span>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => alert("Вещий Манёвр Гамаюна [Mode_Gamayun_Trigger]...")} className="py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-xs text-slate-300 hover:text-emerald-400 flex flex-col items-center justify-center">
                <span>🦅</span><span className="text-[8px] font-mono">Гамаюн</span>
              </button>
              <button onClick={() => alert("Портал Вестника [Mode_BluePortal_Trigger]...")} className="py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-xs text-slate-300 hover:text-cyan-400 flex flex-col items-center justify-center">
                <span>🌐</span><span className="text-[8px] font-mono">Портал</span>
              </button>
              <button onClick={() => alert("Сквозное Прорастание Русалки и Мавок [Mode_Rusalka_Mavka_Trigger]...")} className="py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-xs text-slate-300 hover:text-amber-400 flex flex-col items-center justify-center">
                <span>🧜‍♀️</span><span className="text-[8px] font-mono">Прорастание</span>
              </button>
            </div>
          </div>

          {/* СУВЕРЕННОЕ УПРАВЛЕНИЕ ИИ-МАВКАМИ: Включается пользователем лично! */}
          <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 bg-black/10 p-1.5 rounded-xl border border-slate-800/20 text-center mt-2">
            <label className="flex flex-col items-center p-1 bg-[#161a1d]/40 border border-slate-800/40 rounded-lg cursor-pointer">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-tight">Говорунья</span>
              <input type="checkbox" checked={mavkaGovorun} onChange={() => setMavkaGovorun(!mavkaGovorun)} className="accent-emerald-500 w-3 h-3 mt-1" />
            </label>
            <label className="flex flex-col items-center p-1 bg-[#161a1d]/40 border border-slate-800/40 rounded-lg cursor-pointer">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-tight">Вещунья</span>
              <input type="checkbox" checked={mavkaVeschun} onChange={() => setMavkaVeschun(!mavkaVeschun)} className="accent-cyan-500 w-3 h-3 mt-1" />
            </label>
            <label className="flex flex-col items-center p-1 bg-[#161a1d]/40 border border-slate-800/40 rounded-lg cursor-pointer">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-tight">Берегиня</span>
              <input type="checkbox" checked={mavkaBereginya} onChange={() => setMavkaBereginya(!mavkaBereginya)} className="accent-amber-500 w-3 h-3 mt-1" />
            </label>
          </div>

          {/* КОНТУР ПРОГРЕСС-БАРА ФИБОНАЧЧИ ПО ТИТУЛАМ: Вечный Свет (Total_Minted_Light) */}
          <div className="w-full max-w-md mx-auto space-y-1 bg-[#161a1d]/60 border border-slate-700/30 p-2 rounded-xl text-center font-mono mt-2">
            <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1">
              <span>Высший Титул: Мужчина ➡️ {totalGodsRays ? 'Тропа Богов' : 'Тропа Богинь'}</span>
              <span className="text-emerald-400">Уровень 3 / 5</span>
            </div>
            <div className="w-full bg-black/40 border border-slate-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-full" style={{ width: '37.5%' }}></div>
            </div>
            <div className="flex justify-between text-[7.5px] text-neutral-500 px-0.5">
              <span>50 (Ур.1)</span><span>90 (Ур.2)</span><span className="text-emerald-400 font-bold">150 (Текущий)</span><span>240 (Ур.4)</span><span>400 (Потолок)</span>
            </div>
          </div>

          {/* ИНТЕРФЕЙСНАЯ СЕТКА ИНВЕНТАРЯ: 6 квадратных ячеек-токенов (44x44px) [UI_Mirror_Inventory_Specs] */}
          <div className="w-full bg-black/20 border border-slate-800/40 rounded-xl p-2 flex flex-col gap-2 mt-2">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider text-center block">
              🎒 Волшебный Инвентарь Сказочных Вещей (NFT)
            </span>
            <div className="flex flex-row justify-center gap-2 w-full">
              <button onClick={() => alert("Активирована Путеводная Вешка [⚙️]...")} className="w-11 h-11 rounded-xl bg-[#161a1d]/80 border border-emerald-500/40 flex items-center justify-center text-base hover:border-emerald-400 shadow-inner relative transition-all active:scale-95">📍</button>
              <button onClick={() => alert("Блюдечко запущено! Оверлей «Река Вещания»...")} className="w-11 h-11 rounded-xl bg-[#161a1d]/80 border border-cyan-500/40 flex items-center justify-center text-base hover:border-cyan-400 shadow-inner relative transition-all active:scale-95">🪞</button>
              <button onClick={() => alert("Серебряный Колышек вбит в Поляну...")} className="w-11 h-11 rounded-xl bg-[#161a1d]/80 border border-slate-400/40 flex items-center justify-center text-base hover:border-slate-300 shadow-inner relative transition-all active:scale-95">🔩</button>
              <div className="w-11 h-11 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-base grayscale opacity-30 shadow-md" title="Живая Вода [Блокировано серым туманом]">🧪</div>
              <div className="w-11 h-11 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-base grayscale opacity-30 shadow-md" title="Золотая Вешка [Блокировано серым туманом]">🌟</div>
              <div className="w-11 h-11 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-base grayscale opacity-30 shadow-md" title="Путеводный Клубочек [Блокировано серым туманом]">🪢</div>
            </div>
          </div>

          {/* Системные настройки в подвале шторки */}
          <div className="grid grid-cols-3 gap-2 my-2 w-full">
            <div className="flex flex-col gap-1 p-1.5 rounded-lg border border-slate-800/40 bg-black/10 text-center">
              <span className="text-[8px] text-neutral-500 uppercase tracking-wider">Тема/Диалект</span>
              <button onClick={() => setIsWitchcraftStyle(!isWitchcraftStyle)} className={`w-full py-1 rounded text-[11px] border transition-all ${isWitchcraftStyle ? 'bg-emerald-950/40 border-emerald-800/30 text-emerald-400' : 'bg-slate-900/40 border-slate-700/40 text-cyan-400'}`}>
                {isWitchcraftStyle ? 'Царство' : 'Вестник'}
              </button>
            </div>
            <div className="flex flex-col gap-1 p-1.5 rounded-lg border border-slate-800/40 bg-black/10 text-center">
              <span className="text-[8px] text-neutral-500 uppercase tracking-wider">Подсказки</span>
              <button onClick={() => setHideTooltips(!hideTooltips)} className={`w-full py-1 rounded text-[11px] border transition-all ${hideTooltips ? 'text-neutral-500 border-slate-800' : 'text-emerald-400 border-emerald-800/30 bg-emerald-950/20'}`}>
                {hideTooltips ? 'Гасимы' : 'Явны'}
              </button>
            </div>
            <div className="flex flex-col gap-1 p-1.5 rounded-lg border border-slate-800/40 bg-black/10 text-center">
              <span className="text-[8px] text-neutral-500 uppercase tracking-wider">Почта P2P</span>
              <button onClick={() => setFalconMailMode(prev => prev === 3 ? 1 : prev + 1)} className="w-full py-1 rounded text-[11px] border border-slate-700 bg-slate-900 text-slate-300 font-mono">
                {falconMailMode === 1 ? '🦅 Полёт' : falconMailMode === 2 ? '🪵 Заслон' : '🔒 Затвор'}
              </button>
            </div>
          </div>

          {/* Подвал Быстрого Пульта */}
          <div className="w-full border-t border-slate-800/40 pt-2 flex justify-between items-center select-none shrink-0">
            <span className="text-[10px] text-neutral-600 font-mono italic">[UI_Mirror_Balances_Engine] взведён ладно.</span>
            <button onClick={() => setMirrorState('TOKEN')} className="px-3 py-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700/60 rounded-lg hover:bg-slate-700 transition-all font-medium">
              Свернуть Пульт
            </button>
          </div>
        </div>
      )}

      {/* СЛОЙ 1: СУВЕРЕННАЯ ЛЕТОПИСЬ (Стейт: ВЕСЬ ЭКРАН) — Полный Свиток Славы Рода [UI_Scroll_Glory_Core] */}
      {mirrorState === 'FULL' && (
        <div 
          className={`absolute inset-0 z-50 p-4 md:p-6 flex flex-col justify-between overflow-y-auto scrollbar-none transition-all duration-300 animate-fadeIn
            ${isWitchcraftStyle ? 'bg-[#1a1f22]' : 'bg-[#0f111a]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* УРОВЕНЬ 0: Четыре Лика Истока (Шапка Профиля) */}
          <div className="w-full max-w-md mx-auto bg-black/30 border border-slate-800/50 rounded-xl p-2 flex flex-col gap-2 shrink-0">
            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider text-center block">🌌 Четыре Лика Истока Чертога</span>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { icon: '🐾', name: 'Животное', desc: '🐾 Сакральный зверь-покровитель твоего Чертога.' },
                { icon: '👁️', name: 'Божество', desc: '👁️ Высший Ведический Управитель Кона.' },
                { icon: '🌳', name: 'Древо', desc: '🌳 Родовое Древо из 16 Матриц Числобога.' },
                { icon: '🔮', name: 'Символ', desc: '🔮 Уникальное криптографическое начертание Образа.' }
              ].map((item) => (
                <button 
                  key={item.name}
                  onClick={() => setActiveLegend(activeLegend === item.name ? null : item.desc)}
                  className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg hover:border-emerald-500/40 transition-all flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[8px] font-mono text-neutral-400 mt-0.5">{item.name}</span>
                </button>
              ))}
            </div>
            {/* Slider Panel внутри свитка */}
            {activeLegend && (
              <div className="p-2.5 bg-black/40 border border-slate-800/60 rounded-lg text-[11px] text-slate-300 font-medium font-mono animate-fadeIn">
                {activeLegend}
              </div>
            )}
          </div>

          {/* УРОВЕНЬ I & II: Генезис-Имя, Визитное Слово и Семейно-Родовые Статусы */}
          <div className="w-full max-w-md mx-auto space-y-3 my-3">
            {/* Имя и Визитное слово до 240 символов */}
            <div className="bg-black/20 border border-slate-800/40 rounded-xl p-3 text-center">
              <h3 className="text-base font-bold text-emerald-400 font-serif">Светозар, Сын Ивана, из Рода Ивановых</h3>
              <p className="text-[11px] text-slate-300 font-mono italic mt-1.5 max-w-xs mx-auto line-clamp-3">
                "Кою цифровое инди-ремесло и ИТ-чертежи на благо общины Портала Синяя Береста. Храню суверенный ключ Зеркальца."
              </p>
            </div>

            {/* Семейный статус P2P [Kinship_Scroll_Protocol] */}
            <div className="bg-black/20 border border-slate-800/40 rounded-xl p-3">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block mb-2 text-center">🧬 Кровное Древо Сородичей P2P</span>
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between items-center bg-black/30 p-1.5 border border-slate-800/40 rounded-lg shadow-inner">
                  <span className="text-neutral-400">Жена:</span>
                  <span className="text-amber-400 font-medium animate-pulse">👑 Ладослава (ID: Зеркальце Взведено)</span>
                </div>
                <div className="flex justify-between items-center bg-black/30 p-1.5 border border-slate-800/40 rounded-lg">
                  <span className="text-neutral-400">Батюшка:</span>
                  <span className="text-slate-300 font-medium">Иван Петрович</span>
                </div>
              </div>
            </div>
          </div>

          {/* УРОВЕНЬ III & IV: Летопись Свершений (Медальница с Long Press) и Статус Владений */}
          <div className="w-full max-w-md mx-auto space-y-3 mb-3">
            {/* Медальница */}
            <div className="bg-black/20 border border-slate-800/40 rounded-xl p-3 text-center">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">🏆 Летопись Свершений (Вековые Титулы)</span>
              <div className="flex justify-center gap-4">
                <div 
                  onContextMenu={(e) => { e.preventDefault(); alert("Вспышка силы Серебряного Древа!"); }}
                  className="p-2 bg-gradient-to-b from-amber-600/20 to-amber-950/40 border border-amber-600/40 rounded-lg cursor-help transition-all transform hover:scale-105"
                  title="Удерживайте палец (Long Press) для запуска Canvas-вспышки"
                >
                  <span className="text-sm block">🏆 Воевода 2026</span>
                </div>
              </div>
            </div>

            {/* Статус Владений и Цифровой мох */}
            <div className="bg-black/20 border border-slate-800/40 rounded-xl p-3">
              <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block mb-2 text-center">🔮 Реестр Цифровых Владений</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <button onClick={() => { setCurrentBackground(1); setMirrorState('TOKEN'); }} className="p-2 bg-emerald-950/20 border border-emerald-800/30 rounded-lg text-emerald-400 text-left hover:bg-emerald-950/40 cursor-pointer">
                  🏠 Поляна [Активен]
                </button>
                <div className="p-2 bg-slate-900/40 border border-slate-800 rounded-lg text-neutral-500 text-left grayscale opacity-50 shadow-inner select-none" title="Объект заброшен">
                  🪵 Изба [Цифровой мох]
                </div>
              </div>
            </div>
          </div>

          {/* ПРОТОКОЛ ОБЕРЕГ ВЗОРА: Три независимых кастомизатора графического движка [UI_Eye_Shield_Engine] */}
          <div className="w-full max-w-md mx-auto bg-black/40 border border-slate-800/60 rounded-xl p-2.5 space-y-2 mt-auto shrink-0 text-xs font-mono">
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider text-center block border-b border-slate-800/40 pb-1">👁️ Протокол «Оберег Взора»</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <label className="flex flex-col items-center justify-between p-1 bg-[#161a1d]/40 border border-slate-800 rounded-lg cursor-pointer">
                <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-tight leading-none mb-1">Чистый Холст</span>
                <input type="checkbox" checked={eyeShieldText} onChange={() => setEyeShieldText(!eyeShieldText)} className="accent-emerald-500 w-3 h-3 cursor-pointer" />
              </label>
              <label className="flex flex-col items-center justify-between p-1 bg-[#161a1d]/40 border border-slate-800 rounded-lg cursor-pointer">
                <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-tight leading-none mb-1">Родовая Межа</span>
                <input type="checkbox" checked={eyeShieldPrivacy} onChange={() => setEyeShieldPrivacy(!eyeShieldPrivacy)} className="accent-cyan-500 w-3 h-3 cursor-pointer" />
              </label>
              <label className="flex flex-col items-center justify-between p-1 bg-[#161a1d]/40 border border-slate-800 rounded-lg cursor-pointer">
                <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-tight leading-none mb-1">Зарок Тишины</span>
                <input type="checkbox" checked={eyeShieldStasis} onChange={() => setEyeShieldStasis(!eyeShieldStasis)} className="accent-amber-500 w-3 h-3 cursor-pointer" />
              </label>
            </div>
            
            {/* Глобальный симулятор 9 Фонов Портала по ТЗ */}
            <div className="pt-1.5 border-t border-slate-800/40 flex items-center justify-between gap-2 text-[10px]">
              <span className="text-neutral-500">Симуляция Фонов (1-9):</span>
              <select 
                value={currentBg} 
                onChange={(e) => setCurrentBackground(Number(e.target.value))}
                className="bg-black border border-slate-700 rounded px-2 py-0.5 text-emerald-400 text-[10px] focus:outline-none font-mono cursor-pointer"
              >
                {Object.keys(chatDatabase).map(id => (
                  <option key={id} value={id}>Фон {id} {id === '7' ? '(Вече)' : id === '8' ? '(Вырий)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Кнопка закрытия Летописи */}
          <button 
            onClick={() => setMirrorState('HALF')} 
            className="w-full max-w-xs mx-auto bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl py-2 px-4 text-xs font-semibold tracking-wide transition-all text-center mt-3 shrink-0 cursor-pointer"
          >
            Вернуться в Пульт
          </button>
        </div>
      )}
    </div>
  );
}