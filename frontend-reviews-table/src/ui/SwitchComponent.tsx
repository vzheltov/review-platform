interface SwitchComponentProps {
  leftLabel: string;
  rightLabel: string;
  isRightActive: boolean;
  onChange: () => void;
}

export const SwitchComponent = ({
  leftLabel,
  rightLabel,
  isRightActive,
  onChange,
}: SwitchComponentProps) => {
  return (
    <div
      onClick={onChange}
      className="relative flex w-full bg-slate-800 rounded-lg p-1 cursor-pointer select-none border border-slate-700 h-10"
    >
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-600/80 rounded-md shadow-md transition-all duration-300 ease-out ${
          isRightActive ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
        }`}
      />
      <div
        className={`flex-1 flex items-center justify-center text-xs font-mono font-bold z-10 transition-colors duration-300 ${
          !isRightActive ? "text-white" : "text-slate-500"
        }`}
      >
        {leftLabel}
      </div>
      <div
        className={`flex-1 flex items-center justify-center text-xs font-mono font-bold z-10 transition-colors duration-300 ${
          isRightActive ? "text-white" : "text-slate-500"
        }`}
      >
        {rightLabel}
      </div>
    </div>
  );
};
