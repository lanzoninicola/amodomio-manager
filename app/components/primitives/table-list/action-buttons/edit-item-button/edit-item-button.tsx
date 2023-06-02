import { Link } from "@remix-run/react";
import { Edit } from "lucide-react";

interface EditItemButtonProps {
  to: string;
}

export default function EditItemButton({ to }: EditItemButtonProps) {
  return (
    <Link to={to} className="flex gap-4 items-center">
      <Edit size={"16"} />
      <span>Editar</span>
    </Link>
  );
}
