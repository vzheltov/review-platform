import { StarRating } from "../../../ui/StarRating";
import { getBadgeStyle } from "../../../utils/GetBadgeStyle";

export const RatingCell = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <span
        className={`px-2.5 py-1 rounded-md text-xs border font-mono ${getBadgeStyle(
          rating
        )}`}
      >
        {rating} / 5
      </span>
      <StarRating rating={rating} />
    </div>
  );
};
