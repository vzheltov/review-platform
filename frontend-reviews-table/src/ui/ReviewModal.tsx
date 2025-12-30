import { useEffect } from "react";
import { useZustand } from "../store/useZustand";
import { StarRating } from "./StarRating";
import { getBadgeStyle } from "../utils/GetBadgeStyle";

export const ReviewModal = () => {
  const { activeReview, setActiveReview } = useZustand();

  useEffect(() => {
    if (activeReview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeReview]);

  if (!activeReview) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setActiveReview(null)}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-mono text-xl">
              #{activeReview.id}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-md text-xs border font-mono ${getBadgeStyle(
                  activeReview.rating
                )}`}
              >
                {activeReview.rating} / 5
              </span>
              <StarRating rating={activeReview.rating} />
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
            {activeReview.text}
          </p>
        </div>
        <div className="p-6 border-t border-white/5 bg-slate-800/30 flex justify-end ">
          <button
            type="button"
            onClick={() => setActiveReview(null)}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-base font-medium transition-all border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
