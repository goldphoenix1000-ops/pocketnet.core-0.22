import React, { useState, useEffect, useRef } from 'react';

// [Chislobog_Trees_Matrix] + [UI_Chests_View_Core]
// Родовая Поляна (Фон 1) — Исправленная версия с сочной, контрастной графикой Вепря и Змия
interface MeadowProps {
  activeChertogId?: number;
  onChertogChange?: (id: number) => void;
  currentBackground?: number;
}

export default function MeadowComponent({ 
  activeChertogId: externalChertogId, 
  onChertogChange,
  currentBackground: externalBg 
}: MeadowProps) {
  
  // Истинный ЛОР-реестр 16 Чертогов Круголета Числобога буква в букву, иконки строго 🌳
  const chertogMatrix = [
    { id: 1, name: 'Чертог Вепря', icon: '🌳', tree: 'Груша Истока', god: 'Рамхатъ', code: 'Tree_ID_01' },
    { id: 2, name: 'Чертог Щуки', icon: '🌳', tree: 'Священная Слива', god: 'Рожана', code: 'Tree_ID_02' },
    { id: 3, name: 'Чертог Белого Лебедя', icon: '🌳', tree: 'Священная Берёза', god: 'Макошь', code: 'Tree_ID_03' },
    { id: 4, name: 'Чертог Змия', icon: '🌳', tree: 'Священная Липа', god: 'Семаргл', code: 'Tree_ID_04' },
    { id: 5, name: 'Чертог Варуны', icon: '🌳', tree: 'Священная Лиственница', god: 'Коляда', code: 'Tree_ID_05' },
    { id: 6, name: 'Чертог Медведя', icon: '🌳', tree: 'Священный Букъ', god: 'Сварог', code: 'Tree_ID_06' },
    { id: 7, name: 'Чертог Бусла', icon: '🌳', tree: 'Священная Ивая', god: 'Род', code: 'Tree_ID_07' },
    { id: 8, name: 'Чертог Волка', icon: '🌳', tree: 'Священный Тополь', god: 'Велес', code: 'Tree_ID_08' },
    { id: 9, name: 'Чертог Лисы', icon: '🌳', tree: 'Священный Грабъ', god: 'Марена (Мара)', code: 'Tree_ID_09' },
    { id: 10, name: 'Чертог Тура', icon: '🌳', tree: 'Священная Осина', god: 'Крышень', code: 'Tree_ID_10' },
    { id: 11, name: 'Чертог Лося', icon: '🌳', tree: 'Священная Берёза', god: 'Лада', code: 'Tree_ID_11' },
    { id: 12, name: 'Чертог Финиста', icon: '🌳', tree: 'Священная Вишня', god: 'Вышень', code: 'Tree_ID_12' },
    { id: 13, name: 'Чертог Коня', icon: '🌳', tree: 'Священный Вяз', god: 'Купала', code: 'Tree_ID_13' },
    { id: 14, name: 'Чертог Орла', icon: '🌳', tree: 'Священный Дубъ', god: 'Перун', code: 'Tree_ID_14' },
    { id: 15, name: 'Чертог Раса', icon: '🌳', tree: 'Священный Ясень', god: 'Тархъ (Даждьбог)', code: 'Tree_ID_15' },
    { id: 16, name: 'Чертог Девы', icon: '🌳', tree: 'Священная Яблоня', god: 'Джива', code: 'Tree_ID_16' }
  ];

  const [internalChertogId, setInternalChertogId] = useState(1);
  const chertogId = externalChertogId !== undefined ? externalChertogId : internalChertogId;

  const [balances] = useState({
    yntPersonal: '1,250.00',
    yntDeposit: '40.00',
    rayLight: '12 / 24',
    pathVeles: 450,
    pathPerun: 120,
    pathSvarog: 380,
    vecheLock: 'Взведён'
  });

  const totalGodsRays = balances.pathVeles + balances.pathPerun + balances.pathSvarog;

  const chatDatabase: { [key: number]: { name: string; id: string } } = {
    1: { name: 'Родовая Поляна Чертога (Главный Экран)', id: 'chertog_meadow_main' },
    2: { name: 'Изба (Приватный чат)', id: 'izba_private_chat' },
    3: { name: 'Простой Терем (Камерное Сообщество)', id: 'prostoy_terem_community' },
    4: { name: 'Терем-Артель (Рабочая Мастерская)', id: 'terem_artel_workshop' },
    5: { name: 'Вечевая Палата (Локальный Форум)', id: 'veche_palata_forum' },
    6: { name: 'Княжеский Двор (Супер-Сообщество)', id: 'kniaz_dvor_super_community' },
    7: { name: 'Глобальное Вече Царства (Главная Площадь)', id: 'global_veche_square' },
    8: { name: 'Торговый Вырий (Глобальная Ярмарка)', id: 'torgoviy_vyriy_market' }
  };

  const [visibleOnPhones, setVisibleOnPhones] = useState<{ [key: number]: boolean }>({
    1: true, 2: true, 3: false, 4: true, 5: false, 6: false, 7: false, 8: true
  });

  const [internalBg, setInternalBg] = useState(1);
  const currentBackground = externalBg !== undefined ? externalBg : internalBg;
  
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChertogClick = (id: number) => {
    if (onChertogChange) onChertogChange(id);
    else setInternalChertogId(id);
  };

  const toggleBackgroundVisibility = (id: number) => {
    setVisibleOnPhones({ ...visibleOnPhones, [id]: !visibleOnPhones[id] });
  };

  return (
    // УСИЛЕННЫЙ ЛОР-ГРАДИЕНТ ДЛЯ ВЕПРЯ (№01): Более плотный, сочный контраст янтарного свечения
    <div className={`min-h-screen text-slate-200 font-sans antialiased relative overflow-hidden p-4 md:p-6 flex flex-col justify-between transition-all duration-700
      ${chertogId === 1 ? 'bg-gradient-to-tr from-[#161a1d] via-[#241a15] to-[#451a03]/50' : 'bg-[#161a1d]'}`}>
      
      {/* СЛОЙ 1. Сквозной Пульт Балансов */}
      {visibleOnPhones[currentBackground] ? (
        <div className="w-full max-w-[1152px] mx-auto bg-gradient-to-r from-emerald-800/40 to-slate-800/70 border border-slate-700/40 rounded-xl p-1.5 pr-8 pb-2.5 pt-2.5 mb-6 shadow-xl transition-all duration-300 relative z-30">
          <div className="flex flex-row items-center gap-2.5 overflow-x-auto scrollbar-none justify-start md:justify-between w-full">
            <div className="flex items-center gap-3 shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-4 py-2 rounded-lg">
              <div className="text-center">
                <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-none mb-1">Личный Ларец</span>
                <span className="text-sm font-mono font-medium text-emerald-400">🪞 {balances.yntPersonal}</span>
              </div>
              <div className="w-px h-5 bg-slate-700/60"></div>
              <div className="text-center">
                <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-none mb-1">Ларец Места</span>
                <span className="text-sm font-mono font-medium text-slate-200">🪵 {balances.yntDeposit}</span>
              </div>
            </div>
            <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-4 py-2 rounded-lg text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Искорки Зари</span>
                <span className="text-sm font-mono font-medium text-cyan-400">🌅 {balances.rayLight}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-4 py-1 rounded-lg min-w-[210px]">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block text-center leading-none mb-1.5 select-none font-semibold">
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
            <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-4 py-2 rounded-lg text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Вечевой Залог</span>
                <span className="text-sm font-mono font-medium text-emerald-500">🔒 {balances.vecheLock}</span>
              </div>
            </div>
          </div>
          <button ref={buttonRef} onClick={() => setShowSettings(!showSettings)} className="absolute bottom-1 right-2 text-xs text-slate-500 hover:text-emerald-400 transition-colors p-0.5 select-none focus:outline-none z-40">⚙️</button>
        </div>
      ) : (
        <div className="w-full max-w-[1152px] mx-auto text-right mb-2 relative h-4 z-30">
          <button ref={buttonRef} onClick={() => setShowSettings(!showSettings)} className="absolute right-2 top-0 text-xs text-neutral-600 hover:text-emerald-400 select-none focus:outline-none z-40">⚙️</button>
        </div>
      )}

      {/* ГЛАВНЫЙ АДАТИВНЫЙ ГРИД: Левый ряд Оживлённых Чертогов Числобога */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1152px] mx-auto gap-4 items-stretch overflow-hidden mt-2 relative z-20">
        
        {/* ЛЕВАЯ ПАНЕЛЬ: 16 Чертогов Круголета и Родовых Древ (Ширина строго 64px, иконки строго 🌳) */}
        <div className="w-full md:w-[64px] shrink-0 bg-[#1e2326]/60 border border-slate-700/40 rounded-xl p-1.5 flex flex-col items-center justify-start overflow-x-auto md:overflow-y-auto md:max-h-[calc(100vh-180px)] scrollbar-none shadow-md">
          <div className="flex flex-col text-[7.5px] text-slate-400 font-mono mb-1 uppercase tracking-wider items-center justify-center w-full leading-none select-none shrink-0 text-center">
            <span className="block w-full">16</span>
            <span className="block w-full mt-0.5">Древ</span>
          </div>
          
          <div className="flex flex-row md:flex-col gap-1 items-center w-full justify-start overflow-x-auto md:overflow-x-visible scrollbar-none">
            {chertogMatrix.map((chertog) => (
              <button
                key={chertog.id}
                onClick={() => handleChertogClick(chertog.id)}
                title={`${chertog.name} (Древо: ${chertog.tree}, Покровитель: ${chertog.god})`}
                className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center border transition-all relative cursor-pointer shrink-0 shadow-sm
                  ${chertogId === chertog.id 
                    ? 'bg-gradient-to-b from-emerald-900/50 to-slate-800/40 border-emerald-500/50 font-bold text-emerald-400 scale-95 shadow-inner' 
                    : 'bg-[#161a1d]/60 border-slate-800 hover:border-slate-600 text-slate-400'}`}
              >
                <span className="text-[11px] leading-none">{chertog.icon}</span>
                <span className="text-[7.5px] font-mono leading-none mt-0.5 select-none">
                  {chertog.id < 10 ? `0${chertog.id}` : chertog.id}
                </span>
                {chertogId === chertog.id && (
                  <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ЦЕНТРАЛЬНАЯ ЗОНА: Холст Поляны со сквозными ЛОР-данными */}
        <div className="flex-1 bg-[#1e2326]/30 border border-slate-700/20 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-inner relative">
          
          <div className="text-center w-full mt-2 select-none z-10">
            <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase block mb-0.5 font-semibold">
              Фон {currentBackground}
            </span>
            <h2 className="text-lg font-medium text-slate-200 font-serif tracking-wide transition-all duration-300">
              {chatDatabase[currentBackground] ? chatDatabase[currentBackground].name : 'Портал Синяя Береста'}
            </h2>
            <p className="text-[9px] text-neutral-500 font-mono italic mt-0.5 max-w-xs mx-auto truncate bg-neutral-950/20 px-2 py-0.5 rounded border border-slate-800/30 select-all">
              ID: {chatDatabase[currentBackground] ? chatDatabase[currentBackground].id : 'unknown_node'}
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto bg-[#161a1d]/80 border border-slate-700/40 rounded-xl p-3 text-center space-y-1 z-10 shadow-lg font-mono animate-fadeIn mt-4 relative">
            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider block">
              [{chertogMatrix[chertogId - 1].code}]
            </span>
            
            {/* ГРАФИКА ОРЛА (№14) */}
            {chertogId === 14 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xl animate-bounce duration-[3000ms]">👑🦫</div>
            )}

            <h3 className="text-xs font-bold text-emerald-400 font-serif">
              {chertogMatrix[chertogId - 1].name} (№{chertogId < 10 ? `0${chertogId}` : chertogId})
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800/60 text-slate-300">
              <div className="bg-black/20 p-1.5 rounded border border-slate-800/30">
                <span className="text-neutral-500 block text-[8px] uppercase">Оболочка Древа</span>
                <span className="font-medium text-slate-200">🌳 {chertogMatrix[chertogId - 1].tree}</span>
              </div>
              <div className="bg-black/20 p-1.5 rounded border border-slate-800/30">
                <span className="text-neutral-500 block text-[8px] uppercase">Высшая Сущность</span>
                <span className="font-medium text-amber-500">👁️ {chertogMatrix[chertogId - 1].god}</span>
              </div>
            </div>
          </div>

          {/* ГРАФИКА ЩУКИ (№02) */}
          {chertogId === 2 && (
            <div className="w-full h-4 bg-gradient-to-r from-cyan-600/30 via-sky-500/20 to-blue-600/30 border-t border-cyan-500/20 animate-pulse rounded-lg mt-auto mb-2 flex items-center justify-center text-[9px] text-cyan-400 font-mono tracking-widest z-10">
              🌊 РЕЧЕНЬКА МАВОК БОГА НИЯ 🧜‍♀️
            </div>
          )}

          {/* ОЧАГ И ДРОВА (В самый низ экрана mt-auto mb-2) */}
          <div className="w-full flex flex-col items-center justify-end mt-auto mb-2 relative z-10 select-none">
            <div className="relative w-36 h-24 flex items-center justify-center">
              
              {/* ГРАФИКА ЧЕРТОГА ЗМИЯ (№04): Укрупнённые, яркие, контрастные парящие частицы пламени Яви */}
              {chertogId === 4 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="absolute w-4 h-4 rounded-full bg-gradient-to-t from-red-600 to-orange-500 blur-sm animate-pulse bottom-10 left-6 duration-700"></div>
                  <div className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-t from-orange-500 to-amber-400 blur-xs animate-pulse bottom-14 right-8 duration-1000"></div>
                  <div className="absolute w-4 h-4 rounded-full bg-gradient-to-t from-red-500 via-amber-500 to-orange-400 blur-sm animate-pulse bottom-12 left-14 duration-500"></div>
                </div>
              )}

              <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse duration-[4000ms] ease-in-out scale-110"></div>
              <div 
                className="z-10 text-4xl filter drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-bounce duration-[2500ms] cursor-pointer mb-1" 
                onClick={() => alert(`Костёр ${chertogMatrix[chertogId - 1].name} разгорается сильнее!`)}
              >
                🔥
              </div>
              <div className="absolute bottom-1 z-0 text-xl">🪵</div>
            </div>
          </div>

        </div>
      </div>

      {showSettings && (
        <div ref={settingsRef} className="absolute top-11 right-4 md:right-[calc(50%-576px+16px)] p-4 bg-[#1e2326] border border-slate-700/60 rounded-2xl shadow-2xl max-w-sm w-full animate-fadeIn text-xs text-slate-300 space-y-3 z-50">
          <p className="font-semibold text-emerald-400 border-b border-slate-700/40 pb-1.5">Укажите галочками, на каких Фонах виден Пульт Балансов:</p>
          <div className="grid grid-cols-2 gap-2 font-mono">
            {Object.keys(visibleOnPhones).map((key) => {
              const id = Number(key);
              return (
                <label key={id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-800/40 rounded transition-colors">
                  <input type="checkbox" checked={visibleOnPhones[id]} onChange={() => toggleBackgroundVisibility(id)} className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer" />
                  <span>Фон {id}</span>
                </label>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between gap-2">
            <span className="text-[11px] text-neutral-500">Симулировать переход на:</span>
            <select value={currentBackground} onChange={(e) => setInternalBg(Number(e.target.value))} className="bg-[#161a1d] border border-slate-700 rounded px-2 py-1 focus:outline-none text-emerald-400 font-mono text-[11px]">
              {Object.keys(chatDatabase).map(id => (
                <option key={id} value={id}>Фон {id}</option>
              ))}
            </select>
          </div>
        </div>
      )}

    </div>
  );
}