import React, { useState, useEffect } from 'react';

// Исконный Круголет Числобога: Экран первого входа "Исток Образа" + Финальный Контрастный Контур
export default function GenesisFirstContact() {
  // Стейты экранной физики Навьего тумана
  const [isMistLoading, setIsMistLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Режимы экрана: false = Регистрация (Рождение), true = Экран Захода (Повторный вход)
  const [isLoginMode, setIsLoginStyle] = useState(false);

  // Стейты ввода даты рождения Странника и Ключ-Фразы повторного захода
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
  const [loginKey, setLoginKey] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Стейт триггера кристаллизации [Сотворить Облик] -> Показ Вечевого Оберега
  const [isForged, setIsForged] = useState(false);

  // Стейт глобального провайдера диалекта (true = Волшебный Русский)
  const [isWitchcraftStyle, setIsWitchcraftStyle] = useState(true);

  // Тайминги тумана: Уменьшено время глухого ожидания, растянуто плавное таяние
  useEffect(() => {
    const startFade = setTimeout(() => {
      setIsFadingOut(true); 
    }, 2000); 

    const endLoading = setTimeout(() => {
      setIsMistLoading(false); 
    }, 5000); 

    return () => {
      clearTimeout(startFade);
      clearTimeout(endLoading);
    };
  }, []);

  const handleSimulateMist = () => {
    setIsFadingOut(false);
    setIsMistLoading(true);
    setIsForged(false);
    setTimeout(() => setIsFadingOut(true), 2000);
    setTimeout(() => setIsMistLoading(false), 5000);
  };

  const toggleTooltip = (field: string) => {
    setActiveTooltip(activeTooltip === field ? null : field);
  };

  // Симуляция генерации криптографических ключей Ed25519
  const handleForgePersona = () => {
    if (!birthDate.day || !birthDate.month || !birthDate.year) {
      alert("Заполните все поля даты рождения по Круголету Числобога!");
      return;
    }
    setIsForged(true); 
  };

  // Исполнение повторного захода по Ключ-Фразе
  const handleLoginSubmit = () => {
    if (!loginKey.trim()) {
      alert("Вставьте вашу Ключ-Фразу для входа в Зеркальце!");
      return;
    }
    alert("Ключ-Фраза принята нодой. Пробиваем сокет-мост на Поляну!");
  };

  return (
    /* ОБЩИЙ ФОН: Глубокий, чистый матовый графит (#161a1d) */
    <div className={`min-h-screen text-slate-200 font-sans antialiased relative overflow-hidden transition-all duration-500 bg-[#161a1d]`}>
      
      {/* СЛОЙ 0: ТУМАН ОСВЕТЛЁН ДО СВЕТЛОЙ ПАСМУРНО-СЕРОЙ ДЫМКИ (bg-[#374151]/90) */}
      {isMistLoading && (
        <div className={`absolute inset-0 z-50 bg-[#374151]/90 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-[3000ms] ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-700 animate-pulse shadow-md border border-emerald-500/20 flex items-center justify-center">
            <span className="text-xs text-emerald-200">🪞</span>
          </div>
          <p className="mt-4 text-base font-medium tracking-widest text-emerald-300 animate-bounce">Туман рассеивается...</p>
        </div>
      )}

      {/* КНОПКИ УПРАВЛЕНИЯ В ПРАВОМ НИЖНИМ УГОЛУ ПО ДИАГОНАЛИ */}
      <div className="absolute bottom-4 right-4 z-40 flex gap-2">
        <button onClick={handleSimulateMist} className="px-3 py-1.5 text-xs font-medium bg-[#1e2326] border border-slate-700 rounded hover:bg-slate-800 transition-all text-slate-400">
          Simulate Mist
        </button>
        <button onClick={() => setIsWitchcraftStyle(!isWitchcraftStyle)} className="px-3 py-1.5 text-xs font-medium bg-[#1e2326] border border-slate-700 rounded hover:bg-slate-800 transition-all text-emerald-400">
          {isWitchcraftStyle ? 'Язык: Волшебный' : 'Язык: Modern'}
        </button>
      </div>

      {/* ГЛАВНЫЙ АДАПТИВНЫЙ ГРИД ПОРТАЛА (Сайт, ПК и Смартфон) */}
      <div className="min-h-screen flex flex-col md:flex-row w-full max-w-[1440px] mx-auto p-4 md:p-8 gap-6 items-stretch">
        
        {/* ЛЕВАЯ ПАНЕЛЬ: 16 Чертогов на контрастном матовом фоне */}
        <div className="w-full md:w-[64px] shrink-0 bg-[#1e2326] border border-slate-700/60 rounded-xl p-2 flex flex-col items-center justify-start overflow-x-auto md:overflow-y-auto md:max-h-[calc(100vh-4rem)] scrollbar-none shadow-md">
          <div className="flex flex-col text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider items-start justify-center w-full leading-tight select-none">
            <span className="pl-[15px] block">16</span>
            <span className="block text-center w-full">Чертогов.</span>
          </div>
          <div className="flex flex-row md:flex-col gap-2 items-center w-full justify-start overflow-x-auto md:overflow-x-visible scrollbar-none">
            {[...Array(16)].map((_, i) => (
              <div key={i} title={`Чертог №${i+1}`} className="w-9 h-9 rounded-lg bg-[#262d31] border border-slate-700/40 flex items-center justify-center text-sm grayscale opacity-50 hover:opacity-100 transition-all cursor-pointer shrink-0 shadow-sm">🌲</div>
            ))}
          </div>
        </div>

        {/* ЦЕНТРАЛЬНАЯ ПАНЕЛЬ: Исток Образа */}
        <div className={`flex-1 border border-slate-700/40 rounded-2xl p-6 flex flex-col justify-center max-w-xl mx-auto w-full shadow-2xl transition-all duration-300 ${isLoginMode ? 'bg-gradient-to-b from-cyan-900/40 to-slate-800/80' : 'bg-gradient-to-b from-emerald-800/40 to-slate-800/70'}`}>
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-medium tracking-tight text-emerald-400 mb-1.5 font-serif">
              {isLoginMode ? 'Вход в Зеркальце' : 'Исток Образа'}
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              {isLoginMode ? 'Авторизация по Ключ-Фразе' : 'Чертог по Круголету Числобога'}
            </p>
          </div>

          {/* Переключатель режимов Вход / Регистрация */}
          <div className="flex justify-center mb-6">
            <button 
              onClick={() => { setIsLoginStyle(!isLoginMode); setIsForged(false); }} 
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors underline decoration-slate-700 underline-offset-4 font-semibold"
            >
              {isLoginMode ? 'У меня нет Ключа (Створить Облик)' : 'У меня уже есть Ключ-Фраза (Войти)'}
            </button>
          </div>

          <div className="space-y-6">
            {/* РЕЖИМ А. ЭКРАН ЗАХОДА (Повторный вход) */}
            {isLoginMode && (
              <div className="space-y-4 animate-fadeIn">
                <div className="relative space-y-2">
                  <label className="text-xs font-semibold text-slate-300 tracking-wider block">
                    Ваша Ключ-Фраза (Seed)
                  </label>
                  <input
                    type="password"
                    placeholder="Вставьте ваши 12 слов..."
                    value={loginKey}
                    onChange={(e) => setLoginKey(e.target.value)}
                    className="w-full bg-[#161a1d]/60 border border-slate-700/50 rounded-lg px-4 py-3 text-cyan-400 font-mono focus:border-cyan-400 focus:outline-none transition-all text-sm tracking-wide shadow-inner"
                  />
                </div>
                {/* Текст на кнопке приглушён до text-slate-200 */}
                <button 
                  onClick={handleLoginSubmit}
                  className="w-full bg-[#047857]/90 text-slate-200 border border-emerald-800/30 py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wide shadow-md hover:bg-[#065f46] hover:text-white transition-all active:scale-[0.99]"
                >
                  Войти на Поляну
                </button>
              </div>
            )}

            {/* РЕЖИМ Б. РЕГИСТРАЦИЯ (Форма ввода даты) */}
            {!isLoginMode && !isForged && (
              <div className="grid grid-cols-3 gap-4 animate-fadeIn">
                {['day', 'month', 'year'].map((field) => (
                  <div key={field} className="relative space-y-2">
                    {/* Текст не капсом, но с Заглавной буквы и повышенной яркостью */}
                    <label className="text-xs font-semibold text-slate-300 tracking-wider block">
                      {field === 'day' ? 'День' : field === 'month' ? 'Месяц' : 'Год'}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        maxLength={field === 'year' ? 4 : 2}
                        placeholder={field === 'year' ? '7534' : '01'}
                        value={birthDate[field as keyof typeof birthDate]}
                        onChange={(e) => setBirthDate({ ...birthDate, [field]: e.target.value })}
                        className="w-full bg-[#161a1d]/60 border border-slate-700/50 rounded-lg px-3 py-2 text-center text-slate-100 font-mono focus:border-emerald-500/50 focus:outline-none transition-all text-sm shadow-inner"
                      />
                      <button onClick={() => toggleTooltip(field)} className="absolute right-2 top-[34px] text-xs text-slate-400 hover:text-emerald-400 p-1 transition-colors" style={{ cursor: 'help' }}>
                        ❓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Всплывающие укрупнённые подсказки Ведуна по знакам ❓ */}
            {!isLoginMode && activeTooltip && (
              <div className="bg-[#1e2326] border border-slate-700/50 rounded-lg p-3.5 text-sm text-slate-300 space-y-1 animate-fadeIn border-l-2 border-l-emerald-500 shadow-inner">
                <p>Укажите дату рождения в Явном мире для automatic-конвертации в фиксированный сороковник Коляды Дара.</p>
              </div>
            )}

            {/* Главная запечатывающая кнопка регистрации — Текст приглушён до text-slate-200 */}
            {!isLoginMode && !isForged && (
              <button onClick={handleForgePersona} className="w-full mt-2 bg-[#047857]/90 text-slate-200 border border-emerald-800/30 hover:bg-[#065f46] hover:text-white py-3 px-4 rounded-xl text-sm font-semibold tracking-wide shadow-md transition-all active:scale-[0.99]">
                Сотворить Облик
              </button>
            )}

            {/* ШАГ III и IV: Разворот Вечевого Оберега и Кристаллизации Ключей */}
            {!isLoginMode && isForged && (
              <div className="mt-4 p-4 bg-[#1e2326] border border-slate-700/50 rounded-xl space-y-4 animate-fadeIn border-t-2 border-t-emerald-500 shadow-inner">
                <div className="border-b border-slate-700/40 pb-2">
                  <h4 className="text-sm font-bold text-emerald-400 tracking-wider uppercase">🛡️ Вечевой Оберег взведён!</h4>
                </div>
                
                {/* Генерация Ключа-Истока Ed25519 */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Твой сгенерированный Ключ-Исток (Seed-Фраза):</p>
                  <div className="bg-[#161a1d] border border-slate-700 p-3 rounded-lg font-mono text-xs text-emerald-400 break-all select-all select-text selection:bg-emerald-500/20">
                    beresta_ed25519_root_src_key_svarog_anvil_7534_nature_p2p_lock_example_phrase_save_it
                  </div>
                  <p className="text-xs text-slate-400 italic">💡 Кликни трижды мышкои, чтобы скопировать Ключ.</p>
                </div>

                {/* Инструкции по Сохранению Ключа */}
                <div className="text-xs text-slate-300 space-y-2 border-l border-slate-700 pl-2.5">
                  <p className="text-emerald-400 font-semibold">⚠️ ВНИМАНИЕ: Восстановление через e-mail или SIM-карту НЕВОЗМОЖНО!</p>
                  <p>Сохрани этот Ключ в разных местах по **Методу Зеркального Оберега**:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                    <li>Отправь слепок Обережному Боту в Telegram</li>
                    <li>Резервируй в облаке устройства под биометрию</li>
                    <li>Раздели Ключ на два независимых P2P-свитка</li>
                  </ul>
                  <p className="text-xs text-slate-400 pt-1">👥 **Социальное Восстановление:** Если потеряешь всё — 3 выбранных Хранителя (соратника) смогут вернуть тебе Зеркальце своими блокчейн-ключами!</p>
                </div>

                {/* Кнопка Входа на Поляну */}
                <button onClick={() => alert("Добро пожаловать на Поляну (Фон 1)! Клубочек катится ладно.")} className="w-full bg-[#047857]/90 hover:bg-[#065f46] text-slate-200 hover:text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-lg transition-all">
                  Войти на Родовую Поляну
                </button>
              </div>
            )}

          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: Справочная Панель Ведуна (Видна только на широких ПК/Сайт экранах) */}
        <div className="hidden lg:flex w-[280px] shrink-0 bg-[#1e2326] border border-slate-700/50 rounded-2xl p-4 flex-col gap-4 shadow-xl">
          <div className="border-b border-slate-700/40 pb-2">
            <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase">Справочная Панель Ведуна</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 text-xs text-slate-300 font-medium pr-1 scrollbar-none">
            <p className="text-slate-200 border-l border-slate-700 pl-2">⭐ Добро пожаловать, путник, в Тридевятое Царство!</p>
            <p>Здесь нет цензуры корпораций и слежки Web2-гигантов. Твоё Волшебное Зеркальце — твой личный зашифрованный шлюз в Явь.</p>
            <p>Каждые 6 часов Живая Погода наносекундно пересчитывает Котёл Эмиссии, осыпая Оседлых Жителей каплями Росы Света.</p>
            <p>Изучай Коны Лада, вступай в торговые Артели или Вечевые Палаты, и помни: Родовая суть неизменяема.</p>
          </div>
        </div>

      </div>
    </div>
  );
}