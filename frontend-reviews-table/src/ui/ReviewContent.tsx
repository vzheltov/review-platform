import { useState, useRef, useLayoutEffect } from "react";
import { HighlightText } from "./HighlightText";
import { useZustand } from "../store/useZustand";
import type { Review } from "../components/types";

const MAX_HEIGHT_REM = 3.5;

interface ReviewContentProps {
  text: string;
  highlight: string;
  mode: "partial" | "exact";
  caseSensitive: boolean;
  fullReviewObject: Review;
}

export const ReviewContent = ({
  text,
  highlight,
  mode,
  caseSensitive,
  fullReviewObject,
}: ReviewContentProps) => {
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const { setActiveReview } = useZustand();

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const isOverflowing = element.scrollHeight > element.clientHeight;
    setShowButton(isOverflowing);
  }, [text]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveReview(fullReviewObject);
  };

  return (
    <div className="flex flex-col justify-start w-full h-full relative group">
      <div
        ref={textRef}
        style={{ maxHeight: `${MAX_HEIGHT_REM}rem` }}
        className="text-slate-300 text-sm font-light leading-snug whitespace-normal break-all w-full overflow-hidden relative"
      >
        <HighlightText
          text={text}
          highlight={highlight}
          mode={mode}
          caseSensitive={caseSensitive}
        />
        {showButton && (
          <div className="absolute bottom-0 left-0 w-full h-4 bg-linear-to-t from-slate-900/40 to-transparent pointer-events-none" />
        )}
      </div>

      {showButton && (
        <button
          onClick={handleOpenModal}
          className="text-emerald-500 text-xs font-bold hover:text-emerald-400 hover:underline mt-1 w-max transition-colors cursor-pointer select-none"
        >
          Подробнее...
        </button>
      )}
    </div>
  );
};
