
interface TableItemProps {
  name: string;
  value: string | null;
  hide?: boolean;
}

export default function TableItem({ name, value, hide }: TableItemProps) {
  return (
    <input
      name={name}
      defaultValue={value || ""}
      className="bg-transparent border-none focus:outline-none py-4"
      title={name}
      hidden={hide}
      readOnly
    />
  );
}
