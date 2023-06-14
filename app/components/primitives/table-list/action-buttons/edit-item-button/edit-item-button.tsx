import { Link } from "@remix-run/react";
import { Edit } from "lucide-react";
import Tooltip from "~/components/primitives/tooltip/tooltip";
import { Button } from "~/components/ui/button";

interface EditItemButtonProps {
  to: string;
}

export default function EditItemButton({ to }: EditItemButtonProps) {
  return (
    <Tooltip content="Editar">
      <Link to={to} className="pl-4">
        <Button type="button" variant={"ghost"} size="sm">
          <Edit size={16} />
        </Button>
      </Link>
    </Tooltip>
  );
}
