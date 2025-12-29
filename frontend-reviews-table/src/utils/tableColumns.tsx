import { createColumnHelper } from "@tanstack/react-table";
import type { Review, SearchMode } from "../components/types";
import { IdCell } from "../components/table/cells/IdCell";
import { RatingCell } from "../components/table/cells/RatingCell";
import { ReviewTextCell } from "../components/table/cells/ReviewTextCell";

const columnHelper = createColumnHelper<Review>();

export const createTableColumns = (
  searchQuery: string,
  searchMode: SearchMode,
  isCaseSensitive: boolean
) => [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => <IdCell id={info.getValue()} />,
  }),
  columnHelper.accessor("rating", {
    header: "Рейтинг",
    cell: (info) => <RatingCell rating={info.getValue()} />,
  }),
  columnHelper.accessor("text", {
    header: "Отзыв",
    cell: (info) => (
      <ReviewTextCell
        text={info.getValue()}
        highlight={searchQuery}
        mode={searchMode}
        caseSensitive={isCaseSensitive}
        fullReviewObject={info.row.original}
      />
    ),
  }),
];
