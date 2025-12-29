import type { Review, SearchMode } from "../../types";
import { TABLE_STYLES } from "../../../utils/TableStyles";
import { IdCell } from "../cells/IdCell";
import { RatingCell } from "../cells/RatingCell";
import { ReviewTextCell } from "../cells/ReviewTextCell";

interface Props {
  review: Review;
  searchQuery: string;
  searchMode: SearchMode;
  isCaseSensitive: boolean;
  style?: React.CSSProperties;
}

export const NativeTableRow = ({
  review,
  searchQuery,
  searchMode,
  isCaseSensitive,
  style,
}: Props) => {
  return (
    <tr className={TABLE_STYLES.rowBase} style={style}>
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
};
