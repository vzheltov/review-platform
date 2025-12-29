import { flexRender, Row } from "@tanstack/react-table";
import { TABLE_STYLES } from "../../../utils/TableStyles";
import type { Review } from "../../types";

interface Props {
  row: Row<Review>;
  style?: React.CSSProperties;
  virtualRef?: (node: Element | null) => void;
  dataIndex?: number;
}

export const TanStackTableRow = ({
  row,
  style,
  virtualRef,
  dataIndex,
}: Props) => {
  return (
    <tr
      ref={virtualRef}
      data-index={dataIndex}
      className={TABLE_STYLES.rowBase}
      style={style}
    >
      {row.getVisibleCells().map((cell, index) => (
        <td
          key={cell.id}
          className={
            index === 0
              ? TABLE_STYLES.colId
              : index === 1
              ? TABLE_STYLES.colRating
              : TABLE_STYLES.colText
          }
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
