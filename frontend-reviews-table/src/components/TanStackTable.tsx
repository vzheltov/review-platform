import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { StarRating } from "../ui/StarRating";
import { ReviewContent } from "../ui/ReviewContent";
import type { Review } from "./types";

const columnHelper = createColumnHelper<Review>();

const TanStackTable = ({
  data,
  searchQuery,
  searchMode,
  isCaseSensitive,
}: {
  data: Review[];
  searchQuery: string;
  searchMode: "partial" | "exact";
  isCaseSensitive: boolean;
}) => {
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="text-slate-500 font-mono text-xl">
          #{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("rating", {
      header: "Рейтинг",
      cell: (info) => {
        const r = info.getValue();
        const s =
          r >= 4
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : r === 3
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : "bg-rose-500/10 text-rose-400 border-rose-500/20";
        return (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span
              className={`px-2.5 py-1 rounded-md text-xs border font-mono ${s}`}
            >
              {r} / 5
            </span>
            <StarRating rating={r} />
          </div>
        );
      },
    }),
    columnHelper.accessor("text", {
      header: "Отзыв",
      cell: (info) => (
        <ReviewContent
          text={info.getValue()}
          highlight={searchQuery}
          mode={searchMode}
          caseSensitive={isCaseSensitive}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <table className="min-w-full text-left text-sm border-collapse table-fixed w-full">
        <thead className="h-16 bg-blue-900/40 text-blue-100 text-lg uppercase font-mono backdrop-blur-xl sticky top-0 z-20 shadow-lg block w-full border-b border-blue-500/20">
          {table.getHeaderGroups().map((g) => (
            <tr key={g.id} className="flex w-full h-full">
              {g.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-8 flex items-center h-full w-auto first:w-24 nth-[2]:w-48 last:flex-1"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="block w-full divide-y divide-white/5">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="h-[100px] hover:bg-white/5 transition-colors group flex w-full"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-8 h-full flex items-center py-1 w-auto first:w-24 nth-[2]:w-48 last:flex-1 last:overflow-hidden first:justify-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr className="flex w-full">
              <td className="p-16 w-full text-center text-slate-500">
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default TanStackTable;
