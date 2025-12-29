import { NativeTableHeader } from "../table/headers/NativeTableHeader";
import { NativeTableRow } from "../table/rows/NativeTableRow";
import { EmptyState } from "../table/rows/EmptyState";
import { TABLE_STYLES } from "../../utils/TableStyles";
import type { CommonTableProps } from "../types";

const NativeTable = ({
  data,
  searchQuery,
  searchMode,
  isCaseSensitive,
}: CommonTableProps) => {
  return (
    <div className="w-full h-full">
      <table className="w-full h-full text-left text-sm border-collapse flex flex-col">
        <NativeTableHeader className="shrink-0" />

        <tbody className={`${TABLE_STYLES.tbodyBase} flex-1 flex flex-col`}>
          {data.map((review) => (
            <NativeTableRow
              key={review.id}
              review={review}
              searchQuery={searchQuery}
              searchMode={searchMode}
              isCaseSensitive={isCaseSensitive}
              style={{ flex: 1 }}
            />
          ))}

          {data.length === 0 && <EmptyState />}
        </tbody>
      </table>
    </div>
  );
};

export default NativeTable;
