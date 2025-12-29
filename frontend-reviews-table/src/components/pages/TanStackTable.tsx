import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { TanStackTableHeader } from "../table/headers/TanStackTableHeader";
import { TanStackTableRow } from "../table/rows/TanStackTableRow";
import { EmptyState } from "../table/rows/EmptyState";
import { createTableColumns } from "../../utils/tableColumns";
import type { CommonTableProps } from "../types";
import { TABLE_STYLES } from "../../utils/TableStyles";

const TanStackTable = ({
  data,
  searchQuery,
  searchMode,
  isCaseSensitive,
}: CommonTableProps) => {
  const columns = createTableColumns(searchQuery, searchMode, isCaseSensitive);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full h-full">
      <table className="w-full h-full text-left text-sm border-collapse flex flex-col">
        <TanStackTableHeader table={table} className="shrink-0" />

        <tbody className={`${TABLE_STYLES.tbodyBase} flex-1 flex flex-col`}>
          {table.getRowModel().rows.map((row) => (
            <TanStackTableRow key={row.id} row={row} style={{ flex: 1 }} />
          ))}

          {data.length === 0 && <EmptyState />}
        </tbody>
      </table>
    </div>
  );
};

export default TanStackTable;
