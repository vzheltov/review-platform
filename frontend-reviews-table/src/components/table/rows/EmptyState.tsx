export const EmptyState = ({
  message = "Нет данных",
}: {
  message?: string;
}) => {
  return (
    <tr className="flex w-full">
      <td className="p-16 w-full text-center text-slate-500 italic">
        {message}
      </td>
    </tr>
  );
};
