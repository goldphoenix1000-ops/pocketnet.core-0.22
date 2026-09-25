import React, { useState, useEffect, useRef } from 'react';

// [UI_Chests_View_Core] + [UI_Mirror_Global_Container]
// Родовая Поляна (Фон 1) с ультимативным Сквозным Пультом на 7 Балансов и валидированной Матрицей Фонов
export default function MeadowComponent() {
  // 7 Истинных Балансов Казны (Пункт №1 ТЗ)
  const [balances] = useState({
    yntPersonal: '1,250.00', // Личный Ларец (YNT)
    yntDeposit: '40.00',     // Ларец Места (Залог)
    rayLight: '12 / 24',     // Искорки Зари (Лучики Света)
    pathVeles: 450,          // Тропа Велеса
    pathPerun: 120,          // Тропа Перуна (Синяя молния)
    pathSvarog: 380,         // Тропа Сварога
    vecheLock: 'Взведён'     // Вечевой Залог
  });

  const totalGodsRays = balances.pathVeles + balances.pathPerun + balances.pathSvarog;

  // Валидированная база данных Матрицы Фонов Портала и системных идентификаторов
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

  // Настройки видимости Пульта на всех 8 Фонах
  const [visibleOnPhones, setVisibleOnPhones] = useState<{ [key: number]: boolean }>({
    1: true, 2: true, 3: false, 4: true, 5: false, 6: false, 7: true, 8: true
  });

  const [currentBackground, setCurrentBackground] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [activeChertogId, setActiveChertogId] = useState(1);

  const settingsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Автоматическое закрытие меню при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current && 
        !settingsRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleBackgroundVisibility = (id: number) => {
    setVisibleOnPhones({ ...visibleOnPhones, [id]: !visibleOnPhones[id] });
  };

  return (
    <div className="min-h-screen bg-[#161a1d] text-slate-200 font-sans antialiased relative overflow-hidden p-4 md:p-6 flex flex-col justify-between">
      
      {/* СЛОЙ 1. Сквозной Монолитный Пульт 7 Балансов */}
      {visibleOnPhones[currentBackground] ? (
        <div className="w-full max-w-[1152px] mx-auto bg-gradient-to-r from-emerald-800/40 to-slate-800/70 border border-slate-700/40 rounded-xl p-1.5 pr-8 pb-2.5 pt-2.5 mb-6 shadow-xl transition-all duration-300 relative">
          
          <div className="flex flex-row items-center gap-4 overflow-x-auto scrollbar-none justify-start md:justify-between w-full">
            
            {/* Блок I. Янтарный Капитал */}
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

            {/* Блок II. Живое Время */}
            <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-4 py-2 rounded-lg text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-none mb-1">Искорки Зари</span>
                <span className="text-sm font-mono font-medium text-cyan-400">🌅 {balances.rayLight}</span>
              </div>
            </div>

            {/* Блок III. Триада Троп Богов */}
            <div className="flex flex-col items-center justify-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-4 py-2 rounded-lg min-w-[210px]">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block text-center leading-none mb-1.5 select-none font-semibold">
                Тропы Богов: <span className="text-sm font-mono text-emerald-300 font-black">{totalGodsRays}</span>
              </div>
              <div className="flex items-center gap-3.5 w-full justify-center">
                <div className="text-center">
                  <span className="text-sm font-mono font-medium text-amber-500">🌾 {balances.pathVeles}</span>
                </div>
                <div className="w-px h-3 bg-slate-700/40"></div>
                <div className="text-center">
                  <span className="text-sm font-mono font-medium text-sky-400">⚡ {balances.pathPerun}</span>
                </div>
                <div className="w-px h-3 bg-slate-700/40"></div>
                <div className="text-center">
                  <span className="text-sm font-mono font-medium text-sky-300">☀️ {balances.pathSvarog}</span>
                </div>
              </div>
            </div>

            {/* Блок IV. Вечевой Затвор */}
            <div className="flex items-center shrink-0 bg-[#161a1d]/60 border border-slate-700/50 px-4 py-2 rounded-lg text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-none mb-1">Вечевой Залог</span>
                <span className="text-sm font-mono font-medium text-emerald-500">🔒 {balances.vecheLock}</span>
              </div>
            </div>

          </div>

          <button 
            ref={buttonRef}
            onClick={() => setShowSettings(!showSettings)} 
            className="absolute bottom-1 right-2 text-xs text-slate-500 hover:text-emerald-400 transition-colors p-0.5 select-none focus:outline-none z-40"
          >
            ⚙️
          </button>
        </div>
      ) : (
        <div className="w-full max-w-[1152px] mx-auto text-right mb-2 relative h-4">
          <button ref={buttonRef} onClick={() => setShowSettings(!showSettings)} className="absolute right-2 top-0 text-xs text-neutral-600 hover:text-emerald-400 select-none focus:outline-none z-40">⚙️</button>
        </div>
      )}

      {/* ДИНАМИЧЕСКИЙ ЦЕНТР ЭКРАНА */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto relative select-none">
        <div className="text-center mb-4">
          <span className="text-xs text-emerald-500 font-mono tracking-widest uppercase block mb-1 font-semibold">Фон {currentBackground}</span>
          <h2 className="text-xl font-medium text-slate-200 font-serif tracking-wide transition-all duration-300">
            {chatDatabase[currentBackground].name}
          </h2>
          <p className="text-[10px] text-neutral-500 font-mono italic mt-1 break-all bg-neutral-950/30 border border-slate-800/20 px-2.5 py-0.5 rounded-lg select-all">
            ID: {chatDatabase[currentBackground].id}
          </p>
          <p className="text-[10px] text-neutral-600 font-medium tracking-wider mt-1">Текущий Chertog_ID: {activeChertogId}</p>
        </div>
      </div>

      {/* ОЧАГ И ДРОВА ОПУЩЕНЫ НА ЗЕМЛЮ (В самый низ экрана mt-auto mb-4) */}
      <div className="w-full flex flex-col items-center justify-end mt-auto mb-4 relative z-10 select-none">
        <div className="relative w-36 h-28 flex items-center justify-center">
          {/* Пульсирующий изумрудно-дымчатый ореол света (Анимация дыхания пламени) */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse duration-[4000ms] ease-in-out scale-110"></div>
          <div className="absolute w-20 h-20 rounded-full bg-cyan-500/5 blur-lg animate-ping duration-[6000ms] opacity-30"></div>
          
          {/* Графический очаг костра прижат книзу */}
          <div className="z-10 text-5xl filter drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-bounce duration-[2500ms] cursor-pointer mb-2" onClick={() => alert("Костёр разгорается сильнее!")}>
            🔥
          </div>
          {/* Бревна очага на самой земле */}
          <div className="absolute bottom-1 z-0 text-2xl">🪵</div>
        </div>
      </div>

      {/* МЕНЮ НАСТРОЕК ГАЛОЧЕК (Разворачивается под сжатой плашкой балансов на top-11, не перекрывая ⚙️) */}
      {showSettings && (
        <div 
          ref={settingsRef}
          className="absolute top-11 right-4 md:right-[calc(50%-576px+16px)] p-4 bg-[#1e2326] border border-slate-700/60 rounded-2xl shadow-2xl max-w-sm w-full animate-fadeIn text-xs text-slate-300 space-y-3 z-50"
        >
          <p className="font-semibold text-emerald-400 border-b border-slate-700/40 pb-1.5">Укажите галочками, на каких Фонах виден Пульт Балансов:</p>
          <div className="grid grid-cols-2 gap-2 font-mono">
            {Object.keys(visibleOnPhones).map((key) => {
              const id = Number(key);
              return (
                <label key={id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-800/40 rounded transition-colors">
                  <input 
                    type="checkbox" 
                    checked={visibleOnPhones[id]} 
                    onChange={() => toggleBackgroundVisibility(id)}
                    className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>
                    Фон {id} {
                      id === 1 ? '(Поляна)' : 
                      id === 2 ? '(Изба)' : 
                      id === 3 ? '(Терем)' :
                      id === 4 ? '(Артель)' : 
                      id === 5 ? '(Палата)' :
                      id === 6 ? '(Двор)' :
                      id === 7 ? '(Вече)' :
                      id === 8 ? '(Вырий)' : ''
                    }
                  </span>
                </label>
              );
            })}
          </div>
          
          {/* Переключатель фонов для моментальной симуляции чатов */}
          <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between gap-2">
            <span className="text-[11px] text-neutral-500">Симулировать переход на:</span>
            <select 
              value={currentBackground} 
              onChange={(e) => setCurrentBackground(Number(e.target.value))}
              className="bg-[#161a1d] border border-slate-700 rounded px-2 py-1 focus:outline-none text-emerald-400 font-mono text-[11px]"
            >
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