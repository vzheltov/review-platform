import { useState, useRef, useLayoutEffect } from "react";
import { HighlightText } from "./highlightText";

export const ReviewContent = ({
  text,
  highlight,
  mode,
  caseSensitive,
}: {
  text: string;
  highlight: string;
  mode: "partial" | "exact";
  caseSensitive: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;
    if (!isExpanded) {
      const isOverflowing = element.scrollHeight > element.clientHeight + 1;
      setShowButton(isOverflowing);
    }
  }, [text, isExpanded]);

  return (
    <div className="flex flex-col justify-center w-full h-full overflow-hidden">
      <div
        ref={textRef}
        className={`text-slate-300 text-sm font-light leading-snug whitespace-normal break-all w-full transition-all scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent ${
          !isExpanded ? "line-clamp-3" : "h-full overflow-y-auto pr-2"
        }`}
        title={!isExpanded && showButton ? text : ""}
      >
        <HighlightText
          text={text}
          highlight={highlight}
          mode={mode}
          caseSensitive={caseSensitive}
        />
      </div>

      {(showButton || isExpanded) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-emerald-500 text-xs font-bold hover:text-emerald-400 border-b border-transparent hover:border-emerald-400 transition-colors cursor-pointer select-none mt-0.5 w-max shrink-0"
        >
          {isExpanded ? "Свернуть" : "Подробнее..."}
        </button>
      )}
    </div>
  );
};
