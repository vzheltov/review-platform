import NativeTable from "../pages/NativeTable";
import TanStackTable from "../pages/TanStackTable";
import ScrollCustom from "../pages/ScrollCustom";
import ScrollVirtual from "../pages/ScrollVirtual";
import { useZustand } from "../../store/useZustand";
import type { Review, CommonTableProps, InfiniteTableProps } from "../types";

interface TableViewProps {
  isLoading: boolean;
  isError: boolean;
  reviewsPaginated: Review[];
  allInfiniteRows: Review[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  searchQuery: string;
}

export const TableView = ({
  isLoading,
  isError,
  reviewsPaginated,
  allInfiniteRows,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  searchQuery,
}: TableViewProps) => {
  const { isInfinite, useTanStack, useVirtualizer, isExact, isCaseSensitive } =
    useZustand();

  const searchMode = isExact ? "exact" : "partial";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-emerald-400 font-bold tracking-wider">
          ЗАГРУЗКА
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-rose-500 text-xl font-bold mb-2">Ошибка</div>
        <p className="text-slate-500">Сервер не отвечает</p>
      </div>
    );
  }

  if (isInfinite) {
    const infiniteProps: InfiniteTableProps = {
      data: allInfiniteRows,
      searchQuery,
      searchMode,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      useTanStackRender: useTanStack,
      isCaseSensitive,
    };

    return useVirtualizer ? (
      <ScrollVirtual {...infiniteProps} />
    ) : (
      <ScrollCustom {...infiniteProps} />
    );
  }

  const commonProps: CommonTableProps = {
    data: reviewsPaginated,
    searchQuery,
    searchMode,
    isCaseSensitive,
  };

  return useTanStack ? (
    <TanStackTable {...commonProps} />
  ) : (
    <NativeTable {...commonProps} />
  );
};
