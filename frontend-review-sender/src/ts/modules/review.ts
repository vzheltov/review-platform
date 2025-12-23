import axios from 'axios';
import type { AppState } from './types';

type InitReviewElements = {
  reviewForm: HTMLFormElement | null;
  reviewText: HTMLTextAreaElement | null;
  reviewBtn: HTMLButtonElement | null;
};

type ReviewConfig = {
  textSyncDelayMs: number;
};

const STORAGE_KEYS = {
  RATING: 'selectedRating',
  REVIEW_TEXT: 'reviewText',
  CLOSE_TABS: 'closeAllTabs',
};
const TABLE_URL = 'http://localhost:1414/table/';
function showDialogWindow() {
  const dialog = document.getElementById('dialog-window');
  const timerEl = document.getElementById('timer-count');
  const btnCancel = document.getElementById('modal-cancel');
  const btnGo = document.getElementById('modal-go');
  if (!dialog) return;
  dialog.classList.remove('hidden');
  let secondsLeft = 10;
  const performTransition = () => {
    window.location.href = TABLE_URL;
  };
  const performClose = () => {
    window.close();
    dialog.innerHTML = `
      <div class="modal-window" style="text-align: center;">
         <h3 class="modal-title">Готово</h3>
         <p class="modal-text">Вы можете закрыть вкладку вручную.</p>
      </div>
    `;
  };
  const interval = setInterval(() => {
    secondsLeft--;
    if (timerEl) timerEl.textContent = secondsLeft.toString();
    if (secondsLeft <= 0) {
      clearInterval(interval);
      performTransition();
    }
  }, 1000);
  btnCancel?.addEventListener('click', () => {
    clearInterval(interval);
    performClose();
  });

  btnGo?.addEventListener('click', () => {
    clearInterval(interval);
    performTransition();
  });
}

export function initReview(
  elements: InitReviewElements,
  config: ReviewConfig,
  state: AppState,
  updateUI: () => void,
): void {
  if (!elements.reviewForm || !elements.reviewText) {
    return;
  }

  let textSyncTimer: number;
  elements.reviewText.addEventListener('input', (e) => {
    const textarea = e.currentTarget;
    if (!(textarea instanceof HTMLTextAreaElement)) {
      return;
    }
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    updateUI();

    clearTimeout(textSyncTimer);
    textSyncTimer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.REVIEW_TEXT, textarea.value);
      } catch (error) {
        console.error('Failed to save review text:', error);
      }
    }, config.textSyncDelayMs);
  });
  elements.reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!elements.reviewBtn || elements.reviewBtn.disabled) {
      return;
    }

    const rating = state.getRating();
    const text = elements.reviewText?.value ? elements.reviewText.value : null;

    try {
      await axios.post('/api/reviews', {
        rating: rating,
        text: text,
      });
      showDialogWindow();
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Не удалось отправить отзыв');
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.RATING);
      localStorage.removeItem(STORAGE_KEYS.REVIEW_TEXT);

      localStorage.setItem(STORAGE_KEYS.CLOSE_TABS, Date.now().toString());
    } catch (error) {
      console.error('failed to clear', error);
    }
  });
}
