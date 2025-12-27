import { StarRating } from "../ui/StarRating";
import { ReviewContent } from "../ui/ReviewContent";
import type { Review } from "./types";
import { getBadgeStyle } from "../utils/GetBadgeStyle";

const NativeTable = ({
  data,
  searchQuery,
  searchMode,
  isCaseSensitive,
}: {
  data: Review[];
  searchQuery: string;
  searchMode: "partial" | "exact";
  isCaseSensitive: boolean;
}) => {
  return (
    <div className="w-full h-full">
      <table className="w-full text-left text-sm border-collapse table-fixed">
        <thead className="h-16 bg-slate-800/80 text-slate-300 text-lg uppercase font-mono backdrop-blur-xl sticky top-0 z-20 shadow-lg block w-full border-b border-white/5">
          <tr className="flex w-full h-full">
            <th className="px-8 flex items-center w-24 h-full">ID</th>
            <th className="px-8 flex items-center w-48 h-full">Рейтинг</th>
            <th className="px-8 flex items-center flex-1 h-full">Отзыв</th>
          </tr>
        </thead>

        <tbody className="block w-full divide-y divide-white/5">
          {data.map((review) => (
            <tr
              key={review.id}
              className="h-row hover:bg-white/5 transition-colors group flex w-full"
            >
              <td className="px-8 h-full flex items-center justify-center w-24 text-slate-500 font-mono text-xl">
                #{review.id}
              </td>

              <td className="px-8 h-full flex items-center w-48">
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs border font-mono ${getBadgeStyle(
                      review.rating
                    )}`}
                  >
                    {review.rating} / 5
                  </span>
                  <StarRating rating={review.rating} />
                </div>
              </td>

              <td className="px-8 h-full flex items-center flex-1">
                <div className="inline-block leading-normal">
                  <ReviewContent
                    text={review.text}
                    highlight={searchQuery}
                    mode={searchMode}
                    caseSensitive={isCaseSensitive}
                    fullReviewObject={review}
                  />
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr className="flex w-full">
              <td className="p-16 w-full text-center text-slate-500 italic">
                Нет отзывов
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NativeTable;
