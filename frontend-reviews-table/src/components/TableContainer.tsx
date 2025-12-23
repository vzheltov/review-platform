import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import NativeTable from "./NativeTable";
import TanStackTable from "./TanStackTable";
import ScrollCustom from "./ScrollCustom";
import ScrollVirtual from "./ScrollVirtual";
import SwitchComponent from "../ui/SwitchComponent";
import { useZustand } from "../store/useZustand";
import type { Review } from "./types";

type ApiResponse = {
  data: Review[];
  total: number;
  page: number;
  limit: number;
};

const TableContainer = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    page,
    setPage,
    search,
    setSearch,
    isExact,
    toggleExact,
    isCaseSensitive,
    toggleCaseSensitive,
    isInfinite,
    toggleInfinite,
    useTanStack,
    toggleTanStack,
    useVirtualizer,
    toggleVirtualizer,
    limit,
    dataSource,
    toggleDataSource,
    localReviews,
    fetchLocalData,
    isLocalLoading,
  } = useZustand();

  const isZustandMode = dataSource === "zustand";
  useEffect(() => {
    if (isZustandMode && localReviews.length === 0) {
      fetchLocalData();
    }
  }, [isZustandMode, localReviews.length, fetchLocalData]);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current)
      searchInputRef.current.focus();
  }, [isSearchExpanded]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const closeSearch = () => {
    setSearch("");
    setIsSearchExpanded(false);
  };

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

  const {
    data: dbPaginateData,
    isLoading: isDbLoadingP,
    isError: isDbErrorP,
  } = useQuery({
    queryKey: ["reviews", page, search, isExact, isCaseSensitive],
    queryFn: () => fetchReviews(page),
    placeholderData: (prev) => prev,
    enabled: !isInfinite && !isZustandMode,
  });

  const {
    data: dbInfiniteData,
    fetchNextPage: dbFetchNextPage,
    hasNextPage: dbHasNextPage,
    isFetchingNextPage: dbIsFetchingNextPage,
    isLoading: isDbLoadingI,
    isError: isDbErrorI,
  } = useInfiniteQuery({
    queryKey: ["reviews-infinite", search, isExact, isCaseSensitive],
    queryFn: ({ pageParam = 1 }) => fetchReviews(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < Math.ceil(last.total / last.limit)
        ? last.page + 1
        : undefined,
    enabled: isInfinite && !isZustandMode,
  });

  const zustandProcessedData = useMemo(() => {
    if (!isZustandMode) return { data: [], total: 0 };

    let filtered = localReviews;

    if (search) {
      filtered = filtered.filter((r) => {
        const safeText = r.text || "";
        const text = isCaseSensitive ? safeText : safeText.toLowerCase();
        const query = isCaseSensitive ? search : search.toLowerCase();

        if (isExact) {
          return text.split(" ").includes(query.trim());
        }
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

  const renderContent = () => {
    const searchMode = isExact ? "exact" : "partial";

    if (isInfinite) {
      if (useVirtualizer) {
        return (
          <ScrollVirtual
            data={allInfiniteRows}
            searchQuery={search}
            searchMode={searchMode}
            fetchNextPage={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            useTanStackRender={useTanStack}
            isCaseSensitive={isCaseSensitive}
          />
        );
      }
      return (
        <ScrollCustom
          data={allInfiniteRows}
          searchQuery={search}
          searchMode={searchMode}
          fetchNextPage={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          useTanStackRender={useTanStack}
          isCaseSensitive={isCaseSensitive}
        />
      );
    }

    return useTanStack ? (
      <TanStackTable
        data={reviewsPaginated}
        searchQuery={search}
        searchMode={searchMode}
        isCaseSensitive={isCaseSensitive}
      />
    ) : (
      <NativeTable
        data={reviewsPaginated}
        searchQuery={search}
        searchMode={searchMode}
        isCaseSensitive={isCaseSensitive}
      />
    );
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 relative selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 py-4 flex-1 flex flex-col relative z-10 justify-center">
        {/* Header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-8 z-30 mb-4">
          <h1 className="text-5xl font-mono tracking-tight drop-shadow-lg">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400">
              Мониторинг отзывов
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <button
                onClick={() => setIsSearchExpanded(true)}
                className={`text-4xl transition-all duration-300 cursor-pointer hover:scale-110 ${
                  isSearchExpanded
                    ? "opacity-0 pointer-events-none translate-x-4"
                    : "opacity-100 translate-x-0 text-slate-400"
                }`}
              >
                🔍
              </button>
              <div
                className={`absolute right-0 flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-md p-2 shadow-2xl transition-all duration-500 origin-right z-50 ${
                  isSearchExpanded
                    ? "w-auto opacity-100 scale-100"
                    : "w-0 opacity-0 scale-90 overflow-hidden"
                }`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Найти..."
                  className="w-48 font-mono bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <div className="w-px h-8 bg-slate-700 shrink-0"></div>
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={toggleExact}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md border transition-all cursor-pointer select-none ${
                      isExact
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-transparent border-slate-700 text-slate-400 hover:text-white"
                    }`}
                    title="Искать только целое слово"
                  >
                    <span className="text-lg leading-none">
                      {isExact ? "✅" : "⬜"}
                    </span>
                    <span className="text-sm font-mono uppercase ">Точно</span>
                  </button>
                  <button
                    onClick={toggleCaseSensitive}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md border transition-all cursor-pointer select-none ${
                      isCaseSensitive
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-transparent border-slate-700 text-slate-400 hover:text-white"
                    }`}
                    title="Искать с учетом регистра"
                  >
                    <span className="text-lg leading-none">
                      {isCaseSensitive ? "✅" : "⬜"}
                    </span>
                    <span className="text-sm font-mono uppercase">Aa</span>
                  </button>
                </div>
                <button
                  onClick={closeSearch}
                  className="text-xl hover:scale-110 px-1 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`text-4xl transition-all duration-500 hover:rotate-90 cursor-pointer ${
                showSettings
                  ? "opacity-100 text-emerald-400 scale-110"
                  : "opacity-70 text-slate-400 hover:opacity-100 hover:scale-110"
              }`}
            >
              ⚙️
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-4 shrink-0 justify-center items-start">
          <div className="flex-1 flex flex-col relative z-10 max-w-full">
            <div className="h-[612px] flex flex-col shrink-0 relative bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex-1 overflow-hidden relative flex flex-col">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full animate-pulse">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-emerald-400 font-bold tracking-wider">
                      ЗАГРУЗКА
                    </span>
                  </div>
                ) : isError ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-rose-500 text-xl font-bold mb-2">
                      Ошибка
                    </div>
                    <p className="text-slate-500">Сервер не отвечает</p>
                  </div>
                ) : (
                  renderContent()
                )}
              </div>

              {!isInfinite && !isLoading && !isError && (
                <div className="h-12 shrink-0 flex justify-center items-center gap-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl z-20">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-all shadow-md cursor-pointer hover:text-white"
                  >
                    Назад
                  </button>
                  <span className="text-xs font-mono text-slate-500">
                    Стр. <span className="text-white font-mono">{page}</span> из{" "}
                    {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-all shadow-md cursor-pointer hover:text-white"
                  >
                    Вперед
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl flex flex-col shrink-0 h-[612px] ${
              showSettings
                ? "w-80 opacity-100"
                : "w-0 opacity-0 overflow-hidden border-none"
            }`}
          >
            <div className="p-6 w-80 h-full overflow-y-auto">
              <h2 className="text-lg font-mono text-white mb-8 flex items-center gap-2 border-b border-white/10 pb-4">
                <span>🛠</span> Параметры
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">
                    Данные
                  </div>
                  <SwitchComponent
                    label={isZustandMode ? "Zustand" : "Server"}
                    isChecked={isZustandMode}
                    onChange={toggleDataSource}
                  />
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="space-y-2">
                  <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">
                    Режим просмотра
                  </div>
                  <SwitchComponent
                    label={isInfinite ? "Скролл" : "Пагинация"}
                    isChecked={isInfinite}
                    onChange={toggleInfinite}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">
                    Движок таблицы
                  </div>
                  <SwitchComponent
                    label={useTanStack ? "TanStack Table" : "Native HTML"}
                    isChecked={useTanStack}
                    onChange={toggleTanStack}
                  />
                </div>
                <div
                  className={`transition-all duration-300 overflow-hidden space-y-2 ${
                    isInfinite ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="h-px bg-white/5 my-4"></div>
                  <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">
                    Логика скролла
                  </div>
                  <SwitchComponent
                    label={useVirtualizer ? "TanStack Virtual" : "Custom Math"}
                    isChecked={useVirtualizer}
                    onChange={toggleVirtualizer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableContainer;
