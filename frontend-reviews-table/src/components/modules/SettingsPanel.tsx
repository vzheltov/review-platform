import { SwitchComponent } from "../../ui/SwitchComponent";
import { useZustand } from "../../store/useZustand";

export const SettingsPanel = ({ isVisible }: { isVisible: boolean }) => {
  const {
    isInfinite,
    toggleInfinite,
    useTanStack,
    toggleTanStack,
    useVirtualizer,
    toggleVirtualizer,
    dataSource,
    toggleDataSource,
  } = useZustand();

  const isZustandMode = dataSource === "zustand";

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl flex flex-col shrink-0 h-full ${
        isVisible
          ? "w-80 opacity-100 ml-0"
          : "w-0 opacity-0 overflow-hidden border-none -ml-4"
      }`}
    >
      <div className="p-6 w-80 h-full overflow-y-auto">
        <h2 className="text-lg font-mono text-white mb-8 border-b border-white/10 pb-4">
          🛠 Параметры
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
              Источник
            </div>
            <SwitchComponent
              leftLabel="Server"
              rightLabel="Zustand"
              isRightActive={isZustandMode}
              onChange={toggleDataSource}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
              Режим
            </div>
            <SwitchComponent
              leftLabel="Пагинация"
              rightLabel="Скролл"
              isRightActive={isInfinite}
              onChange={toggleInfinite}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
              Движок таблицы
            </div>
            <SwitchComponent
              leftLabel="Native HTML"
              rightLabel="TanStack"
              isRightActive={useTanStack}
              onChange={toggleTanStack}
            />
          </div>

          <div
            className={`transition-all duration-300 overflow-hidden space-y-2 ${
              isInfinite ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="h-px bg-white/5 my-4"></div>
            <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">
              Виртуализация
            </div>
            <SwitchComponent
              leftLabel="Custom Calc"
              rightLabel="Virtualizer"
              isRightActive={useVirtualizer}
              onChange={toggleVirtualizer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
