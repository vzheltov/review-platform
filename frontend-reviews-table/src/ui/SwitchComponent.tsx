interface SwitchProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}
const SwitchComponent = ({ label, isChecked, onChange }: SwitchProps) => (
  <label className="flex items-center justify-between cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 select-none">
    <span className="text-sm font-medium text-slate-400 group-hover:text-emerald-300 transition-colors">
      {label}
    </span>
    <div className="relative flex items-center ml-4">
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={onChange}
      />
      <div
        className={`w-11 h-6 rounded-full transition-colors duration-300 ${
          isChecked ? "bg-emerald-600 shadow-inner" : "bg-slate-700"
        }`}
      ></div>
      <div
        className={`absolute left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
          isChecked ? "translate-x-5" : "translate-x-0"
        }`}
      ></div>
    </div>
  </label>
);
export default SwitchComponent;
