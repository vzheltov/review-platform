import type { AppState } from './types';

type InitSyncElement = {
  reviewText: HTMLTextAreaElement | null;
};

export function initSyncAndLoad(
  elements: InitSyncElement,
  state: AppState,
  updateUI: () => void,
): void {
  const savedRating = localStorage.getItem('selectedRating');
  const savedText = localStorage.getItem('reviewText');

  if (savedRating) {
    state.setRating(parseInt(savedRating, 10));
  }
  if (savedText && elements.reviewText) {
    elements.reviewText.value = savedText;
    elements.reviewText.style.height = 'auto';
    elements.reviewText.style.height = `${elements.reviewText.scrollHeight}px`;
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'selectedRating') {
      state.setRating(parseInt(e.newValue || '0', 10));
      updateUI();
    }
    if (e.key === 'reviewText' && elements.reviewText) {
      elements.reviewText.value = e.newValue || '';
      elements.reviewText.style.height = 'auto';
      elements.reviewText.style.height = `${elements.reviewText.scrollHeight}px`;
      updateUI();
    }

    if (e.key === 'closeAllTabs') {
      window.close();
    }
  });
}
