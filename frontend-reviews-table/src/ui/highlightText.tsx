export const HighlightText = ({
  text,
  highlight = "",
  mode = "partial",
  caseSensitive = false,
}: {
  text: string;
  highlight?: string;
  mode?: "partial" | "exact";
  caseSensitive?: boolean;
}) => {
  if (!highlight || !highlight.trim()) {
    return <>{text}</>;
  }
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const flags = caseSensitive ? "gu" : "giu";
  let regex: RegExp;

  if (mode === "exact") {
    const notLetterBefore = "(?<![а-яА-Яa-zA-Z0-9])";
    const notLetterAfter = "(?![а-яА-Яa-zA-Z0-9])";
    try {
      regex = new RegExp(
        `(${notLetterBefore}${escapedHighlight}${notLetterAfter})`,
        flags
      );
    } catch {
      regex = new RegExp(`(${escapedHighlight})`, flags);
    }
  } else {
    regex = new RegExp(`(${escapedHighlight})`, flags);
  }
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = caseSensitive
          ? part === highlight
          : part.toLowerCase() === highlight.toLowerCase();

        return isMatch ? (
          <span
            key={i}
            className="bg-emerald-500/20 text-emerald-300 border-b border-emerald-500 font-medium px-1 shadow-sm"
          >
            {part}
          </span>
        ) : (
          part
        );
      })}
    </>
  );
};
