import { ReviewContent } from "../../../ui/ReviewContent";
import type { Review, SearchMode } from "../../types";

interface ReviewTextCellProps {
  text: string;
  highlight: string;
  mode: SearchMode;
  caseSensitive: boolean;
  fullReviewObject: Review;
}

export const ReviewTextCell = ({
  text,
  highlight,
  mode,
  caseSensitive,
  fullReviewObject,
}: ReviewTextCellProps) => {
  return (
    <div className="inline-block leading-normal w-full">
      <ReviewContent
        text={text}
        highlight={highlight}
        mode={mode}
        caseSensitive={caseSensitive}
        fullReviewObject={fullReviewObject}
      />
    </div>
  );
};
