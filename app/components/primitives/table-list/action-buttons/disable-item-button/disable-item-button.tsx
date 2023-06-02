import { Tooltip } from "../../../tooltip/tooltip";
import { EyeOff } from "lucide-react";

export default function DisableItemButton() {
  return (

    <button
      type="submit"
      className="flex gap-4 items-center text-orange-400"
      title="Disabilitar"
      name="_action"
      value="disable"
    >
      <EyeOff size={"16"} />
      <span className="font-md">Disabilitar</span>
    </button>

  );
}
