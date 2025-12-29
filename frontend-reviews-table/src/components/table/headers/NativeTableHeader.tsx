import { TABLE_STYLES } from "../../../utils/TableStyles";

interface Props {
  className?: string;
}

export const NativeTableHeader = ({ className }: Props) => {
  const style = `${
    TABLE_STYLES.headerBase
  } bg-slate-900/80 text-slate-300 border-slate-700 ${className || ""}`;

  return (
    <thead className={style}>
      <tr className={TABLE_STYLES.headerInner}>
        <th className={TABLE_STYLES.colId}>ID</th>
        <th className={TABLE_STYLES.colRating}>Рейтинг</th>
        <th className={TABLE_STYLES.colText}>Отзыв</th>
      </tr>
    </thead>
  );
};
