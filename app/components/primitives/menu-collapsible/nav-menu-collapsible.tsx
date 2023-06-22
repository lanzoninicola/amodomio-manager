import { Link } from "@remix-run/react"
import { ChevronRight, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"


export interface NavItemCollapsible {
    label: string
    to: string
}

interface NavMenuCollapsibleProps {
    navItems: NavItemCollapsible[]
}


export function NavMenuCollapsible({ navItems }: NavMenuCollapsibleProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-2"
        >
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                    Menu
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="py-6 px-4 bg-muted">

                {
                    navItems && navItems.map((item, index) => {

                        return (
                            <Link key={index} to={item.to}>
                                <div className="rounded-md border px-4 py-3 font-mono text-sm mb-2 flex justify-between items-center">
                                    <span>{item.label}</span>
                                    <ChevronRight />
                                </div>
                            </Link>
                        )
                    })
                }



            </CollapsibleContent>
        </Collapsible>
    )
}