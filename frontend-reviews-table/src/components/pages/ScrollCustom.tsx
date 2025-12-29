import React, { useRef, useState, useLayoutEffect } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { remToPx, ROW_HEIGHT_REM } from "../../utils/RemToPx";
import { createTableColumns } from "../../utils/tableColumns";
import { TABLE_STYLES } from "../../utils/TableStyles";
import { ScrollCustomHeader } from "../table/headers/ScrollCustomHeader";
import { NativeTableRow } from "../table/rows/NativeTableRow";
import { TanStackTableRow } from "../table/rows/TanStackTableRow";
import type { InfiniteTableProps } from "../types";

const ScrollCustom = ({
  data,
  searchQuery,
  searchMode,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  useTanStackRender,
  isCaseSensitive,
}: InfiniteTableProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowHeightPx = remToPx(ROW_HEIGHT_REM);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  const columns = createTableColumns(searchQuery, searchMode, isCaseSensitive);
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
      className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
    >
      <table className="w-full text-left text-sm border-collapse">
        <ScrollCustomHeader useTanStack={useTanStackRender} table={table} />

        <tbody className={TABLE_STYLES.tbodyBase}>
          {paddingTop > 0 && (
            <tr className="block w-full border-none">
              <td
                style={{ height: paddingTop, display: "block", width: "100%" }}
              />
            </tr>
          )}

          {useTanStackRender
            ? tableRows
                .slice(startIndex, endIndex)
                .map((row) => <TanStackTableRow key={row.id} row={row} />)
            : data
                .slice(startIndex, endIndex)
                .map((review) => (
                  <NativeTableRow
                    key={review.id}
                    review={review}
                    searchQuery={searchQuery}
                    searchMode={searchMode}
                    isCaseSensitive={isCaseSensitive}
                  />
                ))}

          {paddingBottom > 0 && (
            <tr className="block w-full border-none">
              <td
                style={{
                  height: paddingBottom,
                  display: "block",
                  width: "100%",
                }}
              >
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
