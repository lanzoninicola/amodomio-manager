import { MoreHorizontal, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/modules/shadcn-ui/components/ui/button";

interface DropdownMenuTableRowProps {
    children?: React.ReactNode;
}

export function DropdownMenuTableRow({ children }: DropdownMenuTableRowProps) {

    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="relative">
            <Button type="button" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsOpen(!isOpen)}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            {isOpen &&
                <div className="absolute z-10 top-8 left-0 bg-white rounded-md shadow-md p-4">
                    <div className="relative">
                        <XCircleIcon className="absolute top-0.5 right-0 h-4 w-4" onClick={() => setIsOpen(false)} />
                    </div>
                    {children}
                </div>
            }
        </div>
    )
}

export function DropdownMenuItemTableRow({ children }: DropdownMenuTableRowProps) {
    return (
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            {children}
        </div>
    )
}