export type Review = {
  id: number;
  text: string;
  rating: number;
};

export type SearchMode = "partial" | "exact";

export interface CommonTableProps {
  data: Review[];
  searchQuery: string;
  searchMode: SearchMode;
  isCaseSensitive: boolean;
}

export interface InfiniteTableProps extends CommonTableProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  useTanStackRender: boolean;
}
