const COLOR_VARS = {
  DEFAULT: 'var(--color-header-default)',
  CLICK: 'var(--color-header-click)',
  SPACE: 'var(--color-header-space)',
  SCROLL: 'var(--color-header-scroll)',
};
type HeaderConfig = {
  resetDelayMs: number;
};

export function initHeader(
  headerElement: HTMLElement | null,
  config: HeaderConfig,
): void {
  if (!headerElement) {
    return;
  }
  let resetTimer: number;
  const setHeaderColor = (color: string): void => {
    headerElement.style.backgroundColor = color;
    clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      headerElement.style.backgroundColor = COLOR_VARS.DEFAULT;
    }, config.resetDelayMs);
  };

  document.addEventListener('click', (e: MouseEvent) => {
    if (
      e.target instanceof Element &&
      e.target.closest('button, textarea, a')
    ) {
      return;
    }
    setHeaderColor(COLOR_VARS.CLICK);
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target;
    if (
      target instanceof HTMLElement &&
      e.code === 'Space' &&
      target.tagName !== 'TEXTAREA'
    ) {
      e.preventDefault();
      setHeaderColor(COLOR_VARS.SPACE);
    }
  });

  window.addEventListener('scroll', () => {
    setHeaderColor(COLOR_VARS.SCROLL);
  });
  headerElement.style.backgroundColor = COLOR_VARS.DEFAULT;
}
