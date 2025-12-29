import { useRef, useEffect } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { remToPx, ROW_HEIGHT_REM } from "../../utils/RemToPx";
import { createTableColumns } from "../../utils/tableColumns";
import { ScrollVirtualHeader } from "../table/headers/ScrollVirtualHeader";
import { TanStackTableRow } from "../table/rows/TanStackTableRow";
import { IdCell } from "../table/cells/IdCell";
import { RatingCell } from "../table/cells/RatingCell";
import { ReviewTextCell } from "../table/cells/ReviewTextCell";
import { TABLE_STYLES } from "../../utils/TableStyles";
import type { InfiniteTableProps } from "../types";

const ScrollVirtual = ({
  data,
  searchQuery,
  searchMode,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  useTanStackRender,
  isCaseSensitive,
}: InfiniteTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowHeightPx = remToPx(ROW_HEIGHT_REM);

  const columns = createTableColumns(searchQuery, searchMode, isCaseSensitive);
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
    estimateSize: () => rowHeightPx,
    overscan: 5,
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

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent relative"
    >
      <table className="w-full text-left text-sm border-collapse">
        <ScrollVirtualHeader useTanStack={useTanStackRender} table={table} />

        <tbody className={TABLE_STYLES.tbodyBase}>
          {virtualItems.length > 0 && virtualItems[0].start > 0 && (
            <tr className="block w-full border-none m-0 p-0">
              <td
                style={{
                  height: virtualItems[0].start,
                  display: "block",
                  width: "100%",
                }}
              />
            </tr>
          )}

          {useTanStackRender
            ? virtualItems.map((virtualRow) => {
                const row = tableRows[virtualRow.index];
                return (
                  <TanStackTableRow
                    key={row.id}
                    row={row}
                    dataIndex={virtualRow.index}
                    virtualRef={rowVirtualizer.measureElement}
                  />
                );
              })
            : virtualItems.map((virtualRow) => {
                const review = data[virtualRow.index];
                return (
                  <tr
                    key={review.id}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className={TABLE_STYLES.rowBase}
                  >
                    <td className={TABLE_STYLES.colId}>
                      <IdCell id={review.id} />
                    </td>
                    <td className={TABLE_STYLES.colRating}>
                      <RatingCell rating={review.rating} />
                    </td>
                    <td className={TABLE_STYLES.colText}>
                      <ReviewTextCell
                        text={review.text}
                        highlight={searchQuery}
                        mode={searchMode}
                        caseSensitive={isCaseSensitive}
                        fullReviewObject={review}
                      />
                    </td>
                  </tr>
                );
              })}

          {virtualItems.length > 0 && (
            <tr className="block w-full border-none m-0 p-0">
              <td
                style={{
                  height:
                    rowVirtualizer.getTotalSize() -
                    virtualItems[virtualItems.length - 1].end,
                  display: "block",
                  width: "100%",
                }}
              />
            </tr>
          )}

          {isFetchingNextPage && (
            <tr className="flex w-full justify-center">
              <td className="p-6 text-center text-emerald-500/70 animate-pulse w-full block">
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
