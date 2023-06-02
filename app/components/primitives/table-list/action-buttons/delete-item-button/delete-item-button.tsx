import { Delete } from "lucide-react";
import { Tooltip } from "../../../tooltip/tooltip";

export default function DeleteItemButton() {
  return (
    <button
      type="submit"
      className="text-red-500 flex gap-4 items-center"
      title="Eliminar"
      name="_action"
      value="delete"
    >
      <Delete size={"16"} />
      <span className="font-md">Eliminar</span>
    </button>
  );
}
