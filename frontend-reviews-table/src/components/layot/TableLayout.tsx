import type { ReactNode } from "react";

interface TableLayoutProps {
  children: ReactNode;
}

export const TableLayout = ({ children }: TableLayoutProps) => {
  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 shadow-2xl bg-slate-900/30 backdrop-blur-sm">
      {children}
    </div>
  );
};
