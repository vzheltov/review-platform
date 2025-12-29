import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { ENDPOINTS } from "../config";
import type { Review } from "../components/types";

interface ReviewState {
  page: number;
  limit: number;
  search: string;
  isExact: boolean;
  isCaseSensitive: boolean;
  isInfinite: boolean;

  useTanStack: boolean;
  useVirtualizer: boolean;

  dataSource: "db" | "zustand";
  localReviews: Review[];
  isLocalLoading: boolean;

  activeReview: Review | null;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setActiveReview: (review: Review | null) => void;

  toggleExact: () => void;
  toggleCaseSensitive: () => void;
  toggleInfinite: () => void;

  toggleTanStack: () => void;
  toggleVirtualizer: () => void;

  toggleDataSource: () => void;

  fetchLocalData: () => Promise<void>;
  resetFilters: () => void;
}

export const useZustand = create<ReviewState>()(
  devtools((set) => ({
    page: 1,
    limit: 5,
    search: "",
    isExact: false,
    isCaseSensitive: false,
    isInfinite: false,

    useTanStack: false,
    useVirtualizer: false,

    dataSource: "db",
    localReviews: [],
    isLocalLoading: false,
    activeReview: null,

    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit, page: 1 }),
    setSearch: (search) => set({ search, page: 1 }),
    setActiveReview: (review) => set({ activeReview: review }),

    toggleExact: () => set((state) => ({ isExact: !state.isExact, page: 1 })),
    toggleCaseSensitive: () =>
      set((state) => ({ isCaseSensitive: !state.isCaseSensitive, page: 1 })),
    toggleInfinite: () => set((state) => ({ isInfinite: !state.isInfinite })),

    toggleTanStack: () => set((state) => ({ useTanStack: !state.useTanStack })),
    toggleVirtualizer: () =>
      set((state) => ({ useVirtualizer: !state.useVirtualizer })),

    toggleDataSource: () =>
      set((state) => ({
        dataSource: state.dataSource === "db" ? "zustand" : "db",
        page: 1,
      })),

    fetchLocalData: async () => {
      set({ isLocalLoading: true });
      try {
        const response = await axios.get(ENDPOINTS.REVIEWS, {
          params: { limit: "all" },
        });
        set({ localReviews: response.data.data, isLocalLoading: false });
      } catch (error) {
        console.error("Ошибка загрузки локальных данных", error);
        set({ isLocalLoading: false });
      }
    },

    resetFilters: () =>
      set({
        search: "",
        page: 1,
        isExact: false,
        isCaseSensitive: false,
      }),
  }))
);
