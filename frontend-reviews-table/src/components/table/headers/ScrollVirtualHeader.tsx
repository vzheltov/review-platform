import { flexRender, Table } from "@tanstack/react-table";
import { TABLE_STYLES } from "../../../utils/TableStyles";
import type { Review } from "../../types";

interface Props {
  useTanStack: boolean;
  table?: Table<Review>;
}

export const ScrollVirtualHeader = ({ useTanStack, table }: Props) => {
  const tanStackClass = `${TABLE_STYLES.headerBase} bg-cyan-900 text-cyan-100 border-cyan-500/20`;

  const nativeClass = `${TABLE_STYLES.headerBase} bg-slate-900 text-slate-300 border-cyan-900/50`;

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
