import { useZustand } from "../../store/useZustand";

interface PaginationBarProps {
  totalPages: number;
}

export const PaginationBar = ({ totalPages }: PaginationBarProps) => {
  const { page, setPage } = useZustand();

  return (
    <div className="h-12 shrink-0 flex justify-center items-center gap-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl z-20">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-all shadow-md cursor-pointer hover:text-white"
      >
        Назад
      </button>
      <span className="text-xs font-mono text-slate-500">
        Стр. <span className="text-white font-mono">{page}</span> из{" "}
        {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-all shadow-md cursor-pointer hover:text-white"
      >
        Вперед
      </button>
    </div>
  );
};
