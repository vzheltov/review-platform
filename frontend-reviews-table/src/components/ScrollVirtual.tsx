import { useRef, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { StarRating } from "../ui/StarRating";
import { ReviewContent } from "../ui/ReviewContent";
import type { Review } from "./types";

interface Props {
  data: Review[];
  searchQuery: string;
  searchMode: "partial" | "exact";
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  useTanStackRender: boolean;
  isCaseSensitive: boolean;
}

const columnHelper = createColumnHelper<Review>();

const ScrollVirtual = ({
  data,
  searchQuery,
  searchMode,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  useTanStackRender,
  isCaseSensitive,
}: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(
    () => [
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
    ],
    [searchQuery, searchMode]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const tableRows = table.getRowModel().rows;
  const totalCount = useTanStackRender ? tableRows.length : data.length;

  const rowVirtualizer = useVirtualizer({
    count: totalCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 3,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [last] = [...virtualItems].reverse();
    if (
      last &&
      last.index >= totalCount - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    )
      fetchNextPage();
  }, [
    hasNextPage,
    fetchNextPage,
    totalCount,
    isFetchingNextPage,
    virtualItems,
  ]);

  const getBadgeStyle = (r: number) =>
    r >= 4
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : r === 3
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-rose-500/10 text-rose-400 border-rose-500/20";

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
    >
      <table className="w-full text-left text-sm border-collapse table-fixed">
        <thead className="bg-blue-900/30  text-xl uppercase font-mono sticky top-0 z-10 border-b border-emerald-500/10 backdrop-blur-xl shadow-lg">
          {useTanStackRender ? (
            table.getHeaderGroups().map((g) => (
              <tr key={g.id}>
                {g.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-8 py-6 w-auto first:w-24 nth-[2]:w-48"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <th className="px-8 py-6 w-24">ID</th>
              <th className="px-8 py-6 w-48">Рейтинг</th>
              <th className="px-8 py-6">Отзыв</th>
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-white/5">
          {virtualItems.length > 0 && virtualItems[0].start > 0 && (
            <tr>
              <td colSpan={3} style={{ height: virtualItems[0].start }} />
            </tr>
          )}

          {useTanStackRender
            ? virtualItems.map((virtualRow) => {
                const row = tableRows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="h-[100px] hover:bg-white/5 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-8 py-4 align-middle pt-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            : virtualItems.map((virtualRow) => {
                const review = data[virtualRow.index];
                return (
                  <tr
                    key={review.id}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="h-32 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-8 py-4 text-slate-500 font-mono text-xl align-middle pt-5">
                      #{review.id}
                    </td>
                    <td className="px-8 py-4 align-middle pt-5">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs border font-mono ${getBadgeStyle(
                            review.rating
                          )}`}
                        >
                          {review.rating} / 5
                        </span>
                        <StarRating rating={review.rating} />
                      </div>
                    </td>
                    <td className="px-8 py-4 align-middle pt-5">
                      <ReviewContent
                        text={review.text}
                        highlight={searchQuery}
                        mode={searchMode}
                        caseSensitive={isCaseSensitive}
                      />
                    </td>
                  </tr>
                );
              })}

          {virtualItems.length > 0 && (
            <tr>
              <td
                colSpan={3}
                style={{
                  height:
                    rowVirtualizer.getTotalSize() -
                    virtualItems[virtualItems.length - 1].end,
                }}
              />
            </tr>
          )}
          {isFetchingNextPage && (
            <tr>
              <td
                colSpan={3}
                className="p-6 text-center text-emerald-500/70 animate-pulse"
              >
                Загрузка...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ScrollVirtual;
