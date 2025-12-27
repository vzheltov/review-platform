import React, { useRef, useState, useMemo, useLayoutEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { StarRating } from "../ui/StarRating";
import { ReviewContent } from "../ui/ReviewContent";
import { remToPx } from "../utils/RemToPx";
import type { Review } from "./types";
import { getBadgeStyle } from "../utils/GetBadgeStyle";

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

const ROW_HEIGHT_REM = 6.25;
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
  const rowHeightPx = remToPx(ROW_HEIGHT_REM);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

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
          return (
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span
                className={`px-2.5 py-1 rounded-md text-xs border font-mono ${getBadgeStyle(
                  r
                )}`}
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
          <div className="inline-block leading-normal">
            <ReviewContent
              text={info.getValue()}
              highlight={searchQuery}
              mode={searchMode}
              caseSensitive={isCaseSensitive}
              fullReviewObject={info.row.original}
            />
          </div>
        ),
      }),
    ],
    [searchQuery, searchMode, isCaseSensitive]
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

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeightPx) - 2);
  const endIndex = Math.min(
    totalCount,
    Math.ceil((scrollTop + containerHeight) / rowHeightPx) + 2
  );
  const paddingTop = startIndex * rowHeightPx;
  const extraHeight = hasNextPage ? rowHeightPx : 0;
  const paddingBottom = (totalCount - endIndex) * rowHeightPx + extraHeight;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
    >
      <table className="w-full text-left text-sm border-collapse table-fixed">
        <thead className="h-16 bg-emerald-900 text-slate-300 text-lg uppercase font-mono sticky top-0 z-10 block w-full">
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
                  className="h-row hover:bg-white/5 transition-colors group flex w-full"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-8 h-full flex items-center py-1 w-auto first:w-24 nth-[2]:w-48 last:flex-1 first:justify-center"
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
                  className="h-row hover:bg-white/5 transition-colors group flex w-full"
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
                  <td className="px-8 h-full flex items-center flex-1">
                    <div className="inline-block leading-normal">
                      <ReviewContent
                        text={review.text}
                        highlight={searchQuery}
                        mode={searchMode}
                        caseSensitive={isCaseSensitive}
                        fullReviewObject={review}
                      />
                    </div>
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
