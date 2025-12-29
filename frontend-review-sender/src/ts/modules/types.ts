export type AppState = {
  getRating(): number;
  setRating(rating: number, shouldClearText?: boolean): void;
  subscribe(listener: () => void): void;
};

export type AppElements = {
  header: HTMLElement | null;
  starsContainer: HTMLDivElement | null;
  stars: NodeListOf<HTMLButtonElement>;
  reviewForm: HTMLFormElement | null;
  reviewText: HTMLTextAreaElement | null;
  reviewBtn: HTMLButtonElement | null;
  favicon: HTMLLinkElement | null;
  timeEl: HTMLElement | null;
  dateStringEl: HTMLElement | null;
  langButtons: NodeListOf<HTMLButtonElement>;
};
