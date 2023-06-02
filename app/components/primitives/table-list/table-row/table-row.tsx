import formatDate from "~/utils/format-date";

interface TableRowProps {
  /** the record of data  */
  row: any;
  children: React.ReactNode;
  isProcessing?: boolean;
  clazzName?: string;
  dateColumnsCondensed?: boolean;
}

export default function TableRow({
  row,
  children,
  isProcessing,
  clazzName,
  dateColumnsCondensed
}: TableRowProps) {
  return (
    <li
      data-element="table-row"
      className={`${isProcessing ? "opacity-25" : ""
        } cursor-pointer w-full grid  gap-x-4 p-2 mb-2 text-sm items-center hover:bg-gray-300 ${clazzName}`}
    >
      {children}

      {dateColumnsCondensed ? (
        <TableDateColumnsCondensed
          createdAt={row?.createdAt}
          updatedAt={row?.updatedAt}
        />
      ) : (
        <TableDateColumnsExpanded
          createdAt={row?.createdAt}
          updatedAt={row?.updatedAt}
        />
      )}

    </li>
  );
}

function TableDateColumnsExpanded({ createdAt, updatedAt }: { createdAt: string, updatedAt: string }) {
  let createdAtDate = createdAt ? new Date(createdAt) : null;
  let updatedAtDate = updatedAt ? new Date(updatedAt) : null;

  return (
    <>
      <div>
        <span className="font-body font-medium">
          {formatDate(createdAtDate, "/")}
        </span>
      </div>
      <div>
        <span className="font-body font-medium">
          {formatDate(updatedAtDate, "/")}
        </span>
      </div>
    </>
  )

}


function TableDateColumnsCondensed({ createdAt, updatedAt }: { createdAt: string, updatedAt: string }) {
  let createdAtDate = createdAt ? new Date(createdAt) : null;
  let updatedAtDate = updatedAt ? new Date(updatedAt) : null;

  return (
    <div className="flex flex-col">
      {createdAtDate && (
        <div className="flex flex-col">
          <span className="font-body font-bold text-xs">Criado</span>
          <span className="font-body text-xs">
            {formatDate(createdAtDate, "/")}
          </span>
        </div>
      )}
      {updatedAtDate && (
        <div className="flex flex-col">
          <span className="font-body font-bold text-xs">Atualizado</span>
          <span className="font-body text-xs">
            {formatDate(updatedAtDate, "/")}
          </span>
        </div>
      )}
    </div>
  )

}
