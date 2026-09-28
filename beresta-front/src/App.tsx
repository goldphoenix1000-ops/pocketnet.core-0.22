import React, { useState, useEffect } from 'react';
import IzbaComponent from './IzbaComponent';

// [UI_Mirror_Global_Container] + [Chislobog_Trees_Matrix] + [UI_Vessel_Izba_Core]
// ПОЛНАЯ БОЕВАЯ СБОРКА: Возвращение легендарного Зеркальца Настроек со Свитком Славы и Богами-Покровителями

export default function App() {
  const [isMirrorOpen, setIsMirrorOpen] = useState(false);
  const [selectedChertog, setSelectedChertog] = useState('01');

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand(); // Разворот шторки WebApp вверх силами Telegram
    }
  }, []);

  const handleTreeClick = (treeNum: string) => {
    setSelectedChertog(treeNum);
    setIsMirrorOpen(true); // Клик по любому Древу Числобога мгновенно распахивает Зеркальце!
  };

  // Вычисление Бога-Покровителя и ЛОР-статуса Чертога по Конам ТЗ
  const getChertogSpecs = (num: string) => {
    const n = parseInt(num) || 1;
    if (n === 1 || n === 2) return { name: 'Чертог Девы', god: 'Джива 🌸', light: '150 Лучей' };
    if (n === 3 || n === 4) return { name: 'Чертог Вепря', god: 'Рамхат ⚖️', light: '210 Лучей' };
    if (n === 5 || n === 6) return { name: 'Чертог Щуки', god: 'Рожана 🐟', light: '180 Лучей' };
    if (n === 7 || n === 8) return { name: 'Чертог Лебедя', god: 'Макошь 🦢', light: '320 Лучей' };
    if (n === 9 || n === 10) return { name: 'Чертог Змея', god: 'Семаргл 🔥', light: '240 Лучей' };
    if (n === 11 || n === 12) return { name: 'Чертог Ворона', god: 'Варуна 🪶', light: '190 Лучей' };
    return { name: 'Чертог Орла', god: 'Перун ⚡', light: '450 Лучей' };
  };

  const specs = getChertogSpecs(selectedChertog);

  const trees = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    num: String(i + 1).padStart(2, '0')
  }));

  return (
    <div className="w-screen h-screen bg-[#0d0f12] text-slate-200 overflow-hidden flex flex-col p-3 gap-3 font-mono antialiased relative">
      
      {/* ⚙️ КНОПКА-ШЕСТЕРЁНКА ЗЕРКАЛЬЦА (Парит над интерфейсом чатов) */}
      <button 
        onClick={() => setIsMirrorOpen(!isMirrorOpen)}
        className="absolute top-4 right-6 w-9 h-9 bg-slate-800/90 border border-slate-700/50 rounded-xl flex items-center justify-center text-base hover:border-emerald-500 shadow-xl cursor-pointer z-40 active:scale-95 transition-all text-slate-300"
        title="Быстрый Пульт Зеркальца"
      >
        ⚙️
      </button>

      {/* 🔮 ВЕЛИКИЙ ВЫЕЗЖАЮЩИЙ ОВЕРЛЕЙ ЗЕРКАЛЬЦА [UI_Mirror_Global_Container] (Слой z-50) */}
      {isMirrorOpen && (
        <div className="absolute inset-y-3 right-3 w-80 bg-gradient-to-b from-[#181d22]/98 to-[#0a0d10]/99 border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(4,120,87,0.15)] z-50 flex flex-col gap-4 font-mono animate-fadeIn backdrop-blur-md">
          
          {/* Шапка Зеркальца */}
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 select-none">
            <div className="flex items-center gap-2">
              <span className="text-sm animate-pulse">🔮</span>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Зеркальце Настроек</span>
            </div>
            <button onClick={() => setIsMirrorOpen(false)} className="text-neutral-500 hover:text-red-400 text-xs transition-all cursor-pointer">✕ Скрыть</button>
          </div>
          
          {/* Лики Истока (Профиль Боярина) */}
          <div className="flex items-center gap-3 bg-black/40 border border-slate-800 p-2.5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-lg shadow-inner">👑</div>
            <div className="leading-tight min-w-0">
              <span className="text-[10px] font-bold text-slate-200 block truncate">Суверенный Исток</span>
              <span className="text-[8px] text-emerald-400 font-mono block mt-0.5 uppercase tracking-tight">● Identity_Locked</span>
            </div>
          </div>

          {/* СВИТОК СЛАВЫ РОДА (Динамический ЛОР-блок) */}
          <div className="bg-[#1c2227]/60 border border-slate-800 p-3 rounded-xl text-[10px] space-y-2 leading-tight">
            <span className="text-amber-500 font-bold block uppercase tracking-wide">📜 Свиток Славы Рода:</span>
            <div className="space-y-1.5 font-mono text-slate-300">
              <div className="flex justify-between border-b border-slate-800/40 pb-1"><span>Активный Чертог:</span><b className="text-slate-100 font-black">№ {selectedChertog}</b></div>
              <div className="flex justify-between border-b border-slate-800/40 pb-1"><span>Имя Кона:</span><b className="text-slate-200">{specs.name}</b></div>
              <div className="flex justify-between border-b border-slate-800/40 pb-1"><span>Покровитель:</span><b className="text-amber-400 font-bold">{specs.god}</b></div>
              <div className="flex justify-between"><span>Световой Поток:</span><b className="text-cyan-400">{specs.light}</b></div>
            </div>
          </div>

          {/* Быстрый пульт ИИ-Мавок и параметров ноды Боярина */}
          <div className="flex-1 bg-black/20 border border-slate-900 rounded-xl p-3 space-y-2.5 text-[9px] overflow-y-auto scrollbar-none">
            <span className="text-cyan-400 font-bold block uppercase tracking-wide">🎚️ Быстрый Пульт ИИ-Мавок:</span>
            <div className="space-y-1.5 font-mono">
              <label className="flex items-center justify-between p-1.5 bg-[#161a1d]/60 rounded border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <span className="text-slate-300">ИИ-Мавка Ладослава</span>
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-3 h-3 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between p-1.5 bg-[#161a1d]/60 rounded border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <span className="text-slate-300">Поток Серого Волка (6GB)</span>
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-3 h-3 cursor-pointer" />
              </label>
            </div>
            
            {/* Телеметрия VRAM видеокарты Боярина по ТЗ */}
            <div className="pt-2 border-t border-slate-900 space-y-1">
              <div className="flex justify-between text-[8px] font-bold text-neutral-500 uppercase"><span>Выделенная VRAM Память</span><span>6.4 ГБ / 8.0 ГБ</span></div>
              <div className="w-full bg-black/50 border border-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-cyan-500" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ОСНОВНАЯ ЗОНА ПОРТАЛА */}
      <div className="flex-1 flex flex-row gap-3 overflow-hidden w-full h-full relative">
        
        {/* ЛЕВЫЙ ВЕРТИКАЛЬНЫЙ РЯД 16 ДРЕВ ЧИСЛОБОГА (Строго 64px по ТЗ) */}
        <div className="w-16 h-full bg-[#161a1d]/60 border border-slate-700/40 rounded-2xl p-2 flex flex-col gap-2 overflow-y-auto scrollbar-none shrink-0 shadow-lg items-center select-none z-10">
          {trees.map((tree) => (
            <button
              key={tree.id}
              onClick={() => handleTreeClick(tree.num)}
              className="w-12 h-12 rounded-xl bg-[#1c2124] border border-slate-800 text-[10px] flex flex-col items-center justify-center gap-0.5 hover:border-emerald-500/40 transition-all text-slate-400 shrink-0 cursor-pointer group hover:bg-slate-900 active:scale-95"
            >
              <span className="text-sm group-hover:animate-pulse">🌳</span>
              <span className="text-[7.5px] font-bold text-neutral-500 group-hover:text-emerald-400 font-mono">{tree.num}</span>
            </button>
          ))}
        </div>

        {/* ПРАВАЯ ОСНОВНАЯ ЗОНА: Внутренний мессенджер Синего Вестника */}
        <div className="flex-1 h-full overflow-hidden relative">
          <IzbaComponent />
        </div>

      </div>

    </div>
  );
}
