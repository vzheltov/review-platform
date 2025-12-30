export const TABLE_STYLES = {
  widthId: "w-24",
  widthRating: "w-48",
  widthText: "flex-1 min-w-0",
  rowBase:
    "h-row flex w-full items-center border-b border-white/5 hover:bg-white/5 transition-colors group box-border",

  cellBase: "h-full flex items-center px-8",

  headerBase:
    "h-16 text-lg uppercase font-mono sticky top-0 z-30 block w-full shadow-lg border-b backdrop-blur-xl transition-colors duration-300",
  headerInner: "flex w-full h-full items-center",

  tbodyBase: "block w-full relative",

  get colId() {
    return `${this.widthId} ${this.cellBase} justify-center shrink-0 text-slate-400`;
  },
  get colRating() {
    return `${this.widthRating} ${this.cellBase} shrink-0`;
  },
  get colText() {
    return `${this.widthText} ${this.cellBase}`;
  },
};
