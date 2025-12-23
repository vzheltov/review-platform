import { initHeader } from './modules/header';
import { initStars } from './modules/rating';
import { initReview } from './modules/review';
import { initFavicon } from './modules/favicon';
import { initSyncAndLoad } from './modules/sync';
import { initClockAndLang } from './modules/clock';
import type { AppElements } from './modules/types';

document.addEventListener('DOMContentLoaded', () => {
  const elements: AppElements = {
    header: document.querySelector<HTMLElement>('.main-header'),
    starsContainer: document.querySelector<HTMLDivElement>('.stars-container'),
    stars: document.querySelectorAll<HTMLButtonElement>('.star'),
    reviewForm: document.querySelector<HTMLFormElement>('.review-form'),
    reviewText: document.querySelector<HTMLTextAreaElement>('.review.input'),
    reviewBtn: document.querySelector<HTMLButtonElement>('.review-btn'),
    favicon: document.querySelector<HTMLLinkElement>('#favicon'),
    timeEl: document.getElementById('time'),
    dateStringEl: document.getElementById('date-string'),
    langButtons: document.querySelectorAll<HTMLButtonElement>('.lang-change'),
  };
  function clearReviewField(): void {
    if (elements.reviewText) {
      elements.reviewText.value = '';
      elements.reviewText.style.height = 'auto';
      elements.reviewText.style.height = `${elements.reviewText.scrollHeight}px`;
    }

    try {
      localStorage.removeItem('reviewText');
    } catch (error) {
      console.error('Failed to remove review text from localStorage:', error);
    }
  }
  const state = {
    _rating: 0,
    _listeners: [] as (() => void)[],

    getRating(): number {
      return this._rating;
    },

    setRating(newRating: number) {
      if (this._rating === newRating) return;
      this._rating = newRating;
      clearReviewField();
      this._notify();
    },

    subscribe(listener: () => void) {
      this._listeners.push(listener);
    },

    _notify() {
      this._listeners.forEach((listener) => listener());
    },
  };
  const LOW_RATING = 3;
  function updateUI(): void {
    const currentRating = state.getRating();
    if (elements.starsContainer) {
      elements.starsContainer.dataset.rating = currentRating.toString();
    }
    elements.stars.forEach((star, index) => {
      const starValue = index + 1;
      star.classList.remove('active-first', 'active-middle', 'active-last');
      if (starValue <= currentRating) {
        if (currentRating === 1) {
          star.classList.add('active-first');
        } else if (currentRating === 5) {
          if (starValue === 5) {
            star.classList.add('active-last');
          } else {
            star.classList.add('active-middle');
          }
        } else {
          star.classList.add('active-middle');
        }
      }
    });
    const isLowRating = currentRating > 0 && currentRating <= LOW_RATING;
    if (elements.reviewForm) {
      elements.reviewForm.classList.toggle('low-rating', isLowRating);
    }
    const isTextNeed = isLowRating;
    let hasText = false;
    if (elements.reviewText && elements.reviewText.value) {
      hasText = elements.reviewText.value.trim() !== '';
      elements.reviewText.style.height = 'auto';
      elements.reviewText.style.height = `${elements.reviewText.scrollHeight}px`;
    }
    let isBtnEnabled = false;
    if (currentRating > 0) {
      isBtnEnabled = isTextNeed ? hasText : true;
    }
    if (elements.reviewBtn) {
      elements.reviewBtn.disabled = !isBtnEnabled;
    }
  }
  state.subscribe(updateUI);

  const headerConfig = { resetDelayMs: 500 };
  initHeader(elements.header, headerConfig);
  initStars({ starsContainer: elements.starsContainer }, state);
  const reviewConfig = {
    textSyncDelayMs: 1000,
  };
  initReview(
    {
      reviewForm: elements.reviewForm,
      reviewText: elements.reviewText,
      reviewBtn: elements.reviewBtn,
    },
    reviewConfig,
    state,
    updateUI,
  );
  initFavicon(elements.favicon);
  initSyncAndLoad({ reviewText: elements.reviewText }, state, updateUI);
  const clockConfig = {
    syncIntervalMs: 10000,
  };
  initClockAndLang(
    {
      timeEl: elements.timeEl,
      dateStringEl: elements.dateStringEl,
      langButtons: elements.langButtons,
    },
    clockConfig,
  );
  updateUI();
});
