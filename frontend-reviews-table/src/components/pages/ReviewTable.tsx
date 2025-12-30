import { lazy, Suspense, useMemo } from "react";
import { useZustand } from "../../store/useZustand";
import { useReviewData } from "../../hooks/useReviewData";

import { TableLayout } from "../layot/TableLayout";
import type { SearchMode } from "../types";

const NativeTable = lazy(() => import("./NativeTable"));
const TanStackTable = lazy(() => import("./TanStackTable"));
const ScrollCustom = lazy(() => import("./ScrollCustom"));
const ScrollVirtual = lazy(() => import("./ScrollVirtual"));

const ReviewTable = () => {
  const {
    search,
    isExact,
    isCaseSensitive,
    isInfinite,
    useTanStack,
    useVirtualizer,
  } = useZustand();

  const {
    reviewsPaginated,
    allInfiniteRows,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useReviewData();

  const viewMode = useMemo(() => {
    if (isInfinite) {
      return useVirtualizer ? "scroll-virtual" : "scroll-custom";
    }
    return useTanStack ? "tanstack" : "native";
  }, [isInfinite, useVirtualizer, useTanStack]);

  const currentData = isInfinite ? allInfiniteRows : reviewsPaginated;

  const searchModeValue: SearchMode = isExact ? "exact" : "partial";

  if (isLoading) {
    return (
      <TableLayout>
        <div className="h-full flex items-center justify-center text-emerald-400 text-2xl animate-pulse font-mono">
          Загрузка данных...
        </div>
      </TableLayout>
    );
  }

  if (isError) {
    return (
      <TableLayout>
        <div className="h-full flex items-center justify-center text-rose-400 text-2xl font-mono">
          Ошибка загрузки данных
        </div>
      </TableLayout>
    );
  }

  const commonProps = {
    data: currentData,
    searchQuery: search,
    searchMode: searchModeValue,
    isCaseSensitive,
  };

  const scrollProps = {
    ...commonProps,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    useTanStackRender: useTanStack,
  };

  const renderTable = () => {
    switch (viewMode) {
      case "native":
        return <NativeTable {...commonProps} />;
      case "tanstack":
        return <TanStackTable {...commonProps} />;
      case "scroll-custom":
        return <ScrollCustom {...scrollProps} />;
      case "scroll-virtual":
        return <ScrollVirtual {...scrollProps} />;
      default:
        return <NativeTable {...commonProps} />;
    }
  };

  return (
    <TableLayout>
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center text-slate-500 text-xl animate-pulse font-mono">
            Загрузка компонента...
          </div>
        }
      >
        {renderTable()}
      </Suspense>
    </TableLayout>
  );
};

export default ReviewTable;
