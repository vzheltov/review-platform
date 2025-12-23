export function initFavicon(
  initialFaviconElement: HTMLLinkElement | null,
): void {
  let faviconElement = initialFaviconElement;
  if (!faviconElement) {
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    document.head.appendChild(newFavicon);
    faviconElement = newFavicon;
  }
  const ACTIVE_FAVICON = 'favicon.ico';
  const INACTIVE_FAVICON = 'favicon_non_active.ico';
  const ACTIVE_TITLE = 'Отзыв';
  const INACTIVE_TITLE = 'Вернись 😥';
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      faviconElement.setAttribute('href', INACTIVE_FAVICON);
      document.title = INACTIVE_TITLE;
    } else {
      faviconElement.setAttribute('href', ACTIVE_FAVICON);
      document.title = ACTIVE_TITLE;
    }
  });
  if (document.hidden) {
    faviconElement.setAttribute('href', INACTIVE_FAVICON);
    document.title = INACTIVE_TITLE;
  } else {
    faviconElement.setAttribute('href', ACTIVE_FAVICON);
    document.title = ACTIVE_TITLE;
  }
}
