export const getBadgeStyle = (r: number) =>
  r >= 4
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : r === 3
    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-rose-500/10 text-rose-400 border-rose-500/20";
