import React, { useRef, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
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

const ROW_HEIGHT = 100;
const columnHelper = createColumnHelper<Review>();

const ScrollCustom = ({
  data,
  searchQuery,
  searchMode,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  useTanStackRender,
  isCaseSensitive,
}: Props) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop - clientHeight < 200 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2);
  const endIndex = Math.min(
    totalCount,
    Math.ceil((scrollTop + 500) / ROW_HEIGHT) + 2
  );

  const paddingTop = startIndex * ROW_HEIGHT;

  const extraHeight = hasNextPage ? 100 : 0;

  const paddingBottom = (totalCount - endIndex) * ROW_HEIGHT + extraHeight;

  const getBadgeStyle = (r: number) =>
    r >= 4
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : r === 3
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-rose-500/10 text-rose-400 border-rose-500/20";

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
    >
      <table className="w-full text-left text-sm border-collapse table-fixed">
        <thead className="h-16 bg-lime-900/30 text-lime-400 text-lg uppercase font-mono sticky top-0 z-10 border-b border-lime-500/20 backdrop-blur-xl shadow-lg block w-full">
          {useTanStackRender ? (
            table.getHeaderGroups().map((g) => (
              <tr key={g.id} className="flex w-full h-full">
                {g.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-8 flex items-center w-auto first:w-24 nth-[2]:w-48 last:flex-1"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))
          ) : (
            <tr className="flex w-full h-full">
              <th className="px-8 flex items-center w-24">ID</th>
              <th className="px-8 flex items-center w-48">Рейтинг</th>
              <th className="px-8 flex items-center flex-1">Отзыв</th>
            </tr>
          )}
        </thead>

        <tbody className="block w-full divide-y divide-white/5">
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop, display: "block" }} />
            </tr>
          )}
          {useTanStackRender
            ? tableRows.slice(startIndex, endIndex).map((row) => (
                <tr
                  key={row.id}
                  className="h-[100px] hover:bg-white/5 transition-colors group flex w-full"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-8 h-full flex items-center py-1 w-auto first:w-24 nth-[2]:w-48 last:flex-1 last:overflow-hidden first:justify-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            : data.slice(startIndex, endIndex).map((review) => (
                <tr
                  key={review.id}
                  className="h-[100px] hover:bg-white/5 transition-colors group flex w-full"
                >
                  <td className="px-8 h-full flex items-center justify-center w-24 text-slate-500 font-mono text-xl">
                    #{review.id}
                  </td>
                  <td className="px-8 h-full flex items-center w-48">
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
                  <td className="px-8 h-full flex items-center flex-1 overflow-hidden py-1">
                    <ReviewContent
                      text={review.text}
                      highlight={searchQuery}
                      mode={searchMode}
                      caseSensitive={isCaseSensitive}
                    />
                  </td>
                </tr>
              ))}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: paddingBottom, display: "block" }}>
                {isFetchingNextPage && (
                  <div className="h-full w-full flex items-center justify-center text-lime-500 animate-pulse">
                    Загрузка...
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ScrollCustom;
