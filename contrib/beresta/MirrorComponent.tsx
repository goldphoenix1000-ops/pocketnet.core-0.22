import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// Волшебное Зеркальце — центральный компонент интерфейса
// ============================================================================

/** Диалект речи интерфейса. Язык всегда русский — меняется только стиль подачи. */
type Dialect = 'witchcraft' | 'modern';

/** Состояния простоя (Протокол Озорства). */
type IdleState = 'ACTIVE' | 'PRANK_SPIN' | 'PRANK_SWING';

/** Три Контура Качества. */
type Quality = 'light' | 'medium' | 'high';

// Тайминги простоя, в миллисекундах
const IDLE_SPIN_MS = 16 * 60 * 1000;  // 16 минут — Зеркальце крутит головой
const IDLE_SWING_MS = 27 * 60 * 1000; // 27 минут — качелька

// ---- Сокол Ярилы: триггер [Dawn_Dew_Drop] ----
const FALCON_DAWN_HOUR = 6; // Сокол прилетает не раньше 06:00 утра
const FALCON_LAST_VISIT_KEY = 'beresta_falcon_last_visit_date'; // ключ localStorage: дата последнего визита (YYYY-MM-DD)

/** Хрустальный звук начисления Росы Света при прилёте Сокола. */
const DAWN_DEW_DROP_SOUND_SRC = '/sounds/dawn-dew-drop.mp3';

interface MirrorComponentProps {
  children?: React.ReactNode;
}

const MirrorComponent: React.FC<MirrorComponentProps> = ({ children }) => {
  // ---- Стейт диалекта: true = Волшебный Русский, false = Современный Русский ----
  const [isWitchcraftStyle, setIsWitchcraftStyle] = useState<boolean>(true);

  // ---- Свиток Ведуна: тумблер подсказок "❓" ----
  const [showHints, setShowHints] = useState<boolean>(true);

  // ---- Три Контура Качества ----
  const [quality, setQuality] = useState<Quality>('medium');

  // ---- Протокол Озорства: текущее состояние простоя ----
  const [idleState, setIdleState] = useState<IdleState>('ACTIVE');

  // ---- Сокол Ярилы: прилетел ли Сокол на ветку Древа Чертога сегодня утром ----
  const [isFalconPresent, setIsFalconPresent] = useState<boolean>(false);

  // Таймеры простоя храним в ref, чтобы не пересоздавать эффект на каждый рендер
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Сброс таймеров простоя и возврат Зеркальца в активное состояние. */
  const resetIdleTimers = useCallback(() => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    if (swingTimerRef.current) clearTimeout(swingTimerRef.current);

    setIdleState('ACTIVE');

    // На 16-й минуте — верчение головой и зайчики
    spinTimerRef.current = setTimeout(() => {
      setIdleState('PRANK_SPIN');
    }, IDLE_SPIN_MS);

    // На 27-й минуте — качелька и искры
    swingTimerRef.current = setTimeout(() => {
      setIdleState('PRANK_SWING');
    }, IDLE_SWING_MS);
  }, []);

  // Хук отслеживания простоя: любое касание/клик/нажатие клавиши сбрасывает таймер в ноль
  useEffect(() => {
    resetIdleTimers();

    const events: (keyof DocumentEventMap)[] = [
      'pointerdown', 'touchstart', 'keydown', 'wheel',
    ];
    const handleActivity = () => resetIdleTimers();

    events.forEach((ev) => document.addEventListener(ev, handleActivity, { passive: true }));

    return () => {
      events.forEach((ev) => document.removeEventListener(ev, handleActivity));
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      if (swingTimerRef.current) clearTimeout(swingTimerRef.current);
    };
  }, [resetIdleTimers]);

  // ---- Триггер [Dawn_Dew_Drop]: проверка "после 06:00 и это первый вход сегодня" ----
  useEffect(() => {
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10); // YYYY-MM-DD, для сравнения "тот же день"

    const isAfterDawn = now.getHours() >= FALCON_DAWN_HOUR;
    const lastVisit = localStorage.getItem(FALCON_LAST_VISIT_KEY);
    const isFirstVisitToday = lastVisit !== todayKey;

    if (isAfterDawn && isFirstVisitToday) {
      // Сокол садится на ветку Древа Чертога
      setIsFalconPresent(true);

      // Хрустальный звук начисления Росы Света.
      // play() может быть отклонён автоплей-политикой браузера до первого
      // взаимодействия пользователя со страницей — ошибку проглатываем молча,
      // прилёт Сокола при этом всё равно засчитывается визуально.
      const dewDropAudio = new Audio(DAWN_DEW_DROP_SOUND_SRC);
      dewDropAudio.play().catch(() => {
        /* автоплей заблокирован браузером — не критично */
      });

      // Запоминаем день визита, чтобы Сокол не прилетал повторно до следующего утра
      localStorage.setItem(FALCON_LAST_VISIT_KEY, todayKey);
    }
    // Проверяем один раз при монтировании компонента (при открытии WebApp/входе пользователя)
  }, []);

  // ---- Тексты интерфейса на двух диалектах (язык один — русский) ----
  const labels = {
    title: isWitchcraftStyle ? 'Волшебное Зеркальце' : 'Панель управления',
    dialectToggle: isWitchcraftStyle ? 'Говорить по-простому' : 'Вернуть волшебную речь',
    hintsToggle: showHints ? 'Загасить Подсказки' : 'Зажечь Подсказки',
    qualityLabel: isWitchcraftStyle ? 'Сила Чар' : 'Качество графики',
  };

  return (
    <div className={`mirror-root mirror-quality-${quality} mirror-state-${idleState.toLowerCase()}`}>
      {/* ---- Шапка: заголовок и переключатели ---- */}
      <header className="mirror-header">
        <h1>{labels.title}</h1>

        <div className="mirror-controls">
          {/* Переключатель диалекта */}
          <button onClick={() => setIsWitchcraftStyle((v) => !v)}>
            {labels.dialectToggle}
          </button>

          {/* Свиток Ведуна: тумблер подсказок */}
          <button onClick={() => setShowHints((v) => !v)}>
            {labels.hintsToggle}
          </button>

          {/* Три Контура Качества */}
          <select
            aria-label={labels.qualityLabel}
            value={quality}
            onChange={(e) => setQuality(e.target.value as Quality)}
          >
            <option value="light">Лёгкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>
      </header>

      {/* ---- Тело Зеркальца: рендер зависит от состояния простоя ---- */}
      <main className="mirror-stage">
        <MirrorFace idleState={idleState} quality={quality} isFalconPresent={isFalconPresent} />
        {children}
      </main>

      {/* Пример кнопки с подсказкой, управляемой Свитком Ведуна */}
      <MirrorButton
        label={isWitchcraftStyle ? 'Створить Артефакт' : 'Создать объект'}
        hint="Открывает мастерскую создания предметов"
        showHints={showHints}
        onClick={() => {}}
      />
    </div>
  );
};

// ============================================================================
// Лицо Зеркальца: сцена, реагирующая на простой и на Контур Качества
// ============================================================================

interface MirrorFaceProps {
  idleState: IdleState;
  quality: Quality;
  isFalconPresent: boolean;
}

/**
 * Здесь рендерится сама сцена Зеркальца. Разбивка по стейту:
 * - ACTIVE:      обычное лицо, ждёт действий пользователя
 * - PRANK_SPIN:  Зеркальце крутит головой и пускает солнечные зайчики (16 мин простоя)
 * - PRANK_SWING: рендерится качелька, Зеркальце качается и пускает искры (27 мин простоя)
 *
 * Три Контура Качества [Mirror_Performance_Voice_Gate] — как меняется рендер:
 * - light:  статичные PNG/SVG-спрайты, анимация через CSS-переходы, без частиц,
 *           голосовые реплики — только текстовые подсказки без озвучки.
 * - medium: спрайтовая покадровая анимация (sprite sheet), лёгкие CSS-частицы
 *           (зайчики/искры как псевдоэлементы), голос — сжатые аудиофайлы.
 * - high:   canvas/WebGL-рендер с живой системой частиц (огонь костра, искры
 *           рассчитываются покадрово через requestAnimationFrame), синхронизация
 *           анимации рта с воспроизводимой озвучкой в реальном времени.
 *
 * Сокол Ярилы (isFalconPresent) рендерится поверх основной сцены независимо
 * от idleState — прилёт на рассвете не связан с простоем пользователя.
 */
const MirrorFace: React.FC<MirrorFaceProps> = ({ idleState, quality, isFalconPresent }) => {
  return (
    <div className="mirror-face" data-quality={quality} data-idle={idleState}>
      {idleState === 'ACTIVE' && <div className="mirror-face-idle" />}

      {idleState === 'PRANK_SPIN' && (
        <div className="mirror-face-spin">
          {/* light/medium: CSS-анимация вращения + спрайт зайчиков */}
          {/* high: canvas-частицы солнечных зайчиков */}
        </div>
      )}

      {idleState === 'PRANK_SWING' && (
        <div className="mirror-face-swing">
          {/* Качелька: light — статичный спрайт с CSS-качанием;
              medium/high — покадровая или частичная физика качания + искры */}
        </div>
      )}

      {/*
        Сокол Ярилы садится на ветку Древа Чертога после рассвета (06:00),
        один раз за день — см. триггер [Dawn_Dew_Drop] в MirrorComponent.

        Рендер прилёта по Контурам Качества:
        - light:  Сокол появляется мгновенно как статичный PNG/SVG-спрайт на
                  ветке, без анимации полёта — просто fade-in через CSS-transition
                  (opacity 0 -> 1), чтобы не грузить слабые устройства.
        - medium: спрайтовая покадровая анимация взмаха крыльев при посадке
                  (sprite sheet, 6-8 кадров), лёгкий CSS-parallax ветки от порыва
                  воздуха при посадке птицы.
        - high:   Сокол влетает в кадр по canvas/WebGL-траектории (полёт по кривой
                  Безье к ветке), взмахи крыльев и перья прорисовываются как
                  отдельные слои с покадровой физикой, добавляется частица
                  "капля Росы Света", стекающая с клюва в момент посадки —
                  синхронно со звуком [Dawn_Dew_Drop].
      */}
      {isFalconPresent && <div className="falcon-yarila" />}
    </div>
  );
};

// ============================================================================
// Кнопка с подсказкой, управляемой Свитком Ведуна
// ============================================================================

interface MirrorButtonProps {
  label: string;
  hint: string;
  showHints: boolean;
  onClick: () => void;
}

const MirrorButton: React.FC<MirrorButtonProps> = ({ label, hint, showHints, onClick }) => {
  return (
    <button className="mirror-button" onClick={onClick} title={showHints ? hint : undefined}>
      {label}
      {showHints && <span className="mirror-hint-mark" aria-label={hint}>❓</span>}
    </button>
  );
};

export default MirrorComponent;
