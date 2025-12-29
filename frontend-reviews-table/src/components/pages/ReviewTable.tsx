import { lazy, Suspense, useMemo } from "react";
import { useZustand } from "../../store/useZustand";
import { useReviewData } from "../../hooks/useReviewData";
// Исправлена опечатка в пути import (layot -> layout)
import { TableLayout } from "../layot/TableLayout";

const NativeTable = lazy(() => import("./NativeTable"));
const TanStackTable = lazy(() => import("./TanStackTable"));
const ScrollCustom = lazy(() => import("./ScrollCustom"));
const ScrollVirtual = lazy(() => import("./ScrollVirtual"));

const ReviewTable = () => {
  // 1. Достаем реальные переменные из стора
  const {
    search,
    isExact,
    isCaseSensitive,
    isInfinite,
    useTanStack,
    useVirtualizer,
  } = useZustand();

  // 2. Достаем данные. Хук возвращает разные массивы для пагинации и скролла
  const {
    reviewsPaginated,
    allInfiniteRows,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useReviewData();

  // 3. Вычисляем текущий режим (вместо несуществующего selectedTable)
  const viewMode = useMemo(() => {
    if (isInfinite) {
      return useVirtualizer ? "scroll-virtual" : "scroll-custom";
    }
    return useTanStack ? "tanstack" : "native";
  }, [isInfinite, useVirtualizer, useTanStack]);

  // 4. Выбираем правильный массив данных
  const currentData = isInfinite ? allInfiniteRows : reviewsPaginated;

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

  // Общие пропсы для всех таблиц
  const commonProps = {
    data: currentData,
    searchQuery: search,
    searchMode: isExact ? ("exact" as const) : ("partial" as const),
    isCaseSensitive,
  };

  // Пропсы специфичные для скролла
  const scrollProps = {
    ...commonProps,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    useTanStackRender: useTanStack, // Передаем значение флага из стора
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
