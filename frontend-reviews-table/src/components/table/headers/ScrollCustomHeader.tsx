import { flexRender, Table } from "@tanstack/react-table";
import { TABLE_STYLES } from "../../../utils/TableStyles";
import type { Review } from "../../types";

interface Props {
  useTanStack: boolean;
  table?: Table<Review>;
}

export const ScrollCustomHeader = ({ useTanStack, table }: Props) => {
  const tanStackClass = `${TABLE_STYLES.headerBase} bg-emerald-900 text-emerald-100 border-emerald-500/20`;

  const nativeClass = `${TABLE_STYLES.headerBase} bg-slate-800 text-slate-400 border-slate-700`;

  if (useTanStack && table) {
    return (
      <thead className={tanStackClass}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className={TABLE_STYLES.headerInner}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={
                  header.index === 0
                    ? TABLE_STYLES.colId
                    : header.index === 1
                    ? TABLE_STYLES.colRating
                    : TABLE_STYLES.colText
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
    );
  }

  // Native версия
  return (
    <thead className={nativeClass}>
      <tr className={TABLE_STYLES.headerInner}>
        <th className={TABLE_STYLES.colId}>ID</th>
        <th className={TABLE_STYLES.colRating}>Рейтинг</th>
        <th className={TABLE_STYLES.colText}>Отзыв</th>
      </tr>
    </thead>
  );
};
