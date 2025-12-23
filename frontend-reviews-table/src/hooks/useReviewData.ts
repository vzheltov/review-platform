import { useMemo } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useZustand } from "../store/useZustand";
import type { Review } from "../components/types";

type ApiResponse = {
  data: Review[];
  total: number;
  page: number;
  limit: number;
};

export const useReviewData = () => {
  const {
    page,
    limit,
    search,
    isExact,
    isCaseSensitive,
    isInfinite,
    dataSource,
    localReviews,
    isLocalLoading,
    setPage,
  } = useZustand();

  const isZustandMode = dataSource === "zustand";

  // --- 1. Функция запроса к серверу ---
  const fetchReviews = async (pageParam: number) => {
    const response = await axios.get<ApiResponse>(
      "http://localhost:1414/api/reviews",
      {
        params: {
          page: pageParam,
          limit,
          search,
          searchType: isExact ? "exact" : "partial",
          caseSensitive: isCaseSensitive,
          sortBy: "id",
          order: "desc",
        },
      }
    );
    return response.data;
  };

  // --- 2. React Query (Пагинация) ---
  const {
    data: dbPaginateData,
    isLoading: isDbLoadingP,
    isError: isDbErrorP,
  } = useQuery({
    queryKey: ["reviews", page, search, isExact, isCaseSensitive, limit],
    queryFn: () => fetchReviews(page),
    placeholderData: (prev) => prev,
    enabled: !isInfinite && !isZustandMode,
  });

  // --- 3. React Query (Бесконечный скролл) ---
  const {
    data: dbInfiniteData,
    fetchNextPage: dbFetchNextPage,
    hasNextPage: dbHasNextPage,
    isFetchingNextPage: dbIsFetchingNextPage,
    isLoading: isDbLoadingI,
    isError: isDbErrorI,
  } = useInfiniteQuery({
    queryKey: ["reviews-infinite", search, isExact, isCaseSensitive, limit],
    queryFn: ({ pageParam = 1 }) => fetchReviews(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < Math.ceil(last.total / last.limit)
        ? last.page + 1
        : undefined,
    enabled: isInfinite && !isZustandMode,
  });

  // --- 4. Логика Zustand (In-Memory) ---
  const zustandProcessedData = useMemo(() => {
    if (!isZustandMode) return { data: [], total: 0 };

    let filtered = localReviews;

    if (search) {
      filtered = filtered.filter((r) => {
        const safeText = r.text || "";
        const text = isCaseSensitive ? safeText : safeText.toLowerCase();
        const query = isCaseSensitive ? search : search.toLowerCase();

        if (isExact) return text.split(" ").includes(query.trim());
        return text.includes(query.trim());
      });
    }

    const total = filtered.length;

    if (isInfinite) {
      const endIndex = page * limit;
      return { data: filtered.slice(0, endIndex), total };
    } else {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return { data: filtered.slice(startIndex, endIndex), total };
    }
  }, [
    localReviews,
    search,
    isExact,
    isCaseSensitive,
    page,
    limit,
    isInfinite,
    isZustandMode,
  ]);

  // --- 5. Сборка результатов ---
  const reviewsPaginated = isZustandMode
    ? zustandProcessedData.data
    : dbPaginateData?.data || [];

  const allInfiniteRows = isZustandMode
    ? zustandProcessedData.data
    : dbInfiniteData?.pages.flatMap((p) => p.data) || [];

  const totalDBItems = isZustandMode
    ? zustandProcessedData.total
    : isInfinite
    ? dbInfiniteData?.pages[0]?.total || 0
    : dbPaginateData?.total || 0;

  const totalPages = Math.ceil(totalDBItems / limit) || 1;

  const isLoading = isZustandMode
    ? isLocalLoading
    : isInfinite
    ? isDbLoadingI
    : isDbLoadingP;

  const isError = isZustandMode ? false : isInfinite ? isDbErrorI : isDbErrorP;

  const fetchNextPage = () => {
    if (isZustandMode) {
      if (page < totalPages) setPage(page + 1);
    } else {
      dbFetchNextPage();
    }
  };

  const hasNextPage = isZustandMode ? page < totalPages : !!dbHasNextPage;
  const isFetchingNextPage = isZustandMode ? false : !!dbIsFetchingNextPage;

  return {
    reviewsPaginated,
    allInfiniteRows,
    totalDBItems,
    totalPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
