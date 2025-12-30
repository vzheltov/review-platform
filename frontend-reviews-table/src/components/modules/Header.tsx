import { useState, useRef, useEffect } from "react";
import { useZustand } from "../../store/useZustand";

interface HeaderProps {
  onToggleSettings: () => void;
  showSettings: boolean;
}

export const Header = ({ onToggleSettings, showSettings }: HeaderProps) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    search,
    setSearch,
    isExact,
    toggleExact,
    isCaseSensitive,
    toggleCaseSensitive,
  } = useZustand();

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current)
      searchInputRef.current.focus();
  }, [isSearchExpanded]);

  const closeSearch = () => {
    setSearch("");
    setIsSearchExpanded(false);
  };

  return (
    <div className="h-16 shrink-0 flex items-center justify-between z-30 mb-4 px-2">
      <h1 className="text-5xl font-mono tracking-tight drop-shadow-lg">
        <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400">
          Мониторинг отзывов
        </span>
      </h1>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <button
            onClick={() => setIsSearchExpanded(true)}
            className={`text-4xl transition-all duration-300 cursor-pointer hover:scale-110 ${
              isSearchExpanded
                ? "opacity-0 pointer-events-none translate-x-4"
                : "opacity-100 translate-x-0 text-slate-400"
            }`}
          >
            🔍
          </button>
          <div
            className={`absolute right-0 flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-md p-2 shadow-2xl transition-all duration-500 origin-right z-50 ${
              isSearchExpanded
                ? "w-auto opacity-100 scale-100"
                : "w-0 opacity-0 scale-90 overflow-hidden"
            }`}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти..."
              className="w-48 font-mono bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            <div className="w-px h-8 bg-slate-700 shrink-0"></div>
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={toggleExact}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md border transition-all cursor-pointer select-none ${
                  isExact
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-transparent border-slate-700 text-slate-400 hover:text-white"
                }`}
                title="Искать только целое слово"
              >
                <span className="text-lg leading-none">
                  {isExact ? "✅" : "⬜"}
                </span>
                <span className="text-sm font-mono uppercase ">Точно</span>
              </button>
              <button
                onClick={toggleCaseSensitive}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md border transition-all cursor-pointer select-none ${
                  isCaseSensitive
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-transparent border-slate-700 text-slate-400 hover:text-white"
                }`}
                title="Искать с учетом регистра"
              >
                <span className="text-lg leading-none">
                  {isCaseSensitive ? "✅" : "⬜"}
                </span>
                <span className="text-sm font-mono">Aa</span>
              </button>
            </div>
            <button
              onClick={closeSearch}
              className="text-xl hover:scale-110 px-1 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-800 mx-2"></div>
        <button
          onClick={onToggleSettings}
          className={`text-4xl transition-all duration-500 hover:rotate-90 cursor-pointer ${
            showSettings
              ? "opacity-100 text-emerald-400 scale-110"
              : "opacity-70 text-slate-400 hover:opacity-100 hover:scale-110"
          }`}
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};
