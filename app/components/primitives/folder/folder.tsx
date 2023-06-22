import { ChevronsUpDown, PlusCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"


interface FolderProps {
    title: string
    children: React.ReactNode
    onClick?: () => void
}

export default function Folder({ title, children, onClick }: FolderProps) {
    const [isOpen, setIsOpen] = useState(false)

    let buttonProps = {}
    if (isOpen === false && onClick) {
        buttonProps = { onClick }
    }

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-4"
        >
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                    {title}
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0" {...buttonProps} >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="p-4">
                {children}
            </CollapsibleContent>
        </Collapsible >
    )
}