import type { AppState } from './types';

type InitStarsElements = {
  starsContainer: HTMLDivElement | null;
};

export function initStars(elements: InitStarsElements, state: AppState): void {
  if (!elements.starsContainer) {
    return;
  }
  elements.starsContainer.addEventListener('click', (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const starButton = e.target.closest<HTMLElement>('.star');
    if (starButton && starButton.dataset.value) {
      const clickedRating = parseInt(starButton.dataset.value, 10);
      const currentRating = state.getRating();
      const newRating = currentRating === clickedRating ? 0 : clickedRating;
      try {
        localStorage.setItem('selectedRating', newRating.toString());
      } catch (error) {
        console.error('failed save', error);
      }

      state.setRating(newRating, true);
    }
  });
}
