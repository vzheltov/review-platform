export const getRemValue = (): number => {
  if (typeof window === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const remToPx = (rem: number): number => {
  return rem * getRemValue();
};
