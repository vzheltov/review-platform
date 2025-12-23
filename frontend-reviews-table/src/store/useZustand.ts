import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import type { Review } from "../components/types"; // Убедитесь, что путь к типам верный

interface ReviewState {
  // --- Стандартные поля ---
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

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
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

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),

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
        const response = await axios.get("http://localhost:1414/api/reviews", {
          params: { limit: 10000, page: 1 }, //без этого all
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
