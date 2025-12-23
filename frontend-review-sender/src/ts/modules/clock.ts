type InitClockElements = {
  timeEl: HTMLElement | null;
  dateStringEl: HTMLElement | null;
  langButtons: NodeListOf<HTMLButtonElement>;
};

type ClockConfig = {
  syncIntervalMs: number;
};
const LOCAL_STORAGE_LANG_KEY = 'language';
const SUPPORTED_LANGS = ['ru', 'zh'];
const DEFAULT_LANG = SUPPORTED_LANGS[0];

function isSupportedLang(lang: string): boolean {
  return SUPPORTED_LANGS.includes(lang);
}

export function initClockAndLang(
  elements: InitClockElements,
  config: ClockConfig,
): void {
  let timeFormatter: Intl.DateTimeFormat;
  let dateFormatter: Intl.DateTimeFormat;
  let clockTimerId: number;
  let lastRenderedTime = Date.now();
  if (!elements.timeEl || !elements.dateStringEl) {
    console.warn('Clock elements not found');
    return;
  }

  function createTimeFormatter(lang: string) {
    return new Intl.DateTimeFormat(lang, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  function createDateFormatter(lang: string) {
    return new Intl.DateTimeFormat(lang, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  function updateFormatters(lang: string): void {
    timeFormatter = createTimeFormatter(lang);
    dateFormatter = createDateFormatter(lang);
  }

  function renderTime(timestamp: number) {
    const dateObject = new Date(timestamp);
    if (elements.timeEl) {
      elements.timeEl.textContent = timeFormatter.format(dateObject);
    }
    if (elements.dateStringEl) {
      elements.dateStringEl.textContent = dateFormatter.format(dateObject);
    }
  }
  function getNextUpdateTime(): number {
    const now = new Date();
    const syncIntervalSeconds = config.syncIntervalMs / 1000;
    const secondsPastMark = now.getSeconds() % syncIntervalSeconds;

    if (secondsPastMark === 0 && now.getMilliseconds() === 0) {
      return 0;
    }

    const secondsToNextMark = syncIntervalSeconds - secondsPastMark;
    return secondsToNextMark * 1000 - now.getMilliseconds();
  }
  function updateClock(): void {
    lastRenderedTime = Date.now();
    renderTime(Date.now());
    clockTimerId = window.setTimeout(updateClock, config.syncIntervalMs);
  }
  function startSynchronizedClock(): void {
    if (clockTimerId) {
      clearTimeout(clockTimerId);
    }
    const now = new Date();
    const syncIntervalSeconds = config.syncIntervalMs / 1000;
    const roundedSeconds =
      Math.floor(now.getSeconds() / syncIntervalSeconds) * syncIntervalSeconds;
    const roundedTime = new Date(now);
    roundedTime.setSeconds(roundedSeconds, 0);

    lastRenderedTime = roundedTime.getTime();
    renderTime(lastRenderedTime);
    const delay = getNextUpdateTime();
    clockTimerId = window.setTimeout(updateClock, delay);
  }

  function setLocale(lang: string): void {
    updateFormatters(lang);
    elements.langButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
    }
    renderTime(lastRenderedTime);
  }

  elements.langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang && isSupportedLang(btn.dataset.lang)) {
        setLocale(btn.dataset.lang);
      }
    });
  });
  window.addEventListener('storage', (e) => {
    if (
      e.key === LOCAL_STORAGE_LANG_KEY &&
      e.newValue &&
      isSupportedLang(e.newValue)
    ) {
      setLocale(e.newValue);
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(clockTimerId);
    } else {
      renderTime(lastRenderedTime);
      startSynchronizedClock();
    }
  });

  let savedLang: string;
  try {
    const langFromStorage = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    savedLang =
      langFromStorage && isSupportedLang(langFromStorage)
        ? langFromStorage
        : DEFAULT_LANG;
  } catch (error) {
    console.error('Failed to load language from localStorage:', error);
    savedLang = DEFAULT_LANG;
  }
  setLocale(savedLang);

  startSynchronizedClock();
}
