import { flexRender, Table } from "@tanstack/react-table";
import { TABLE_STYLES } from "../../../utils/TableStyles";
import type { Review } from "../../types";

interface Props {
  table: Table<Review>;
  className?: string;
}

export const TanStackTableHeader = ({ table, className }: Props) => {
  const style = `${
    TABLE_STYLES.headerBase
  } bg-blue-900/60 text-blue-100 border-blue-500/20 ${className || ""}`;

  return (
    <thead className={style}>
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
};
