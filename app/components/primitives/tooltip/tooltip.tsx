import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Tooltip as ShadcnTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


interface TooltipProps {
    children: React.ReactNode
    content: React.ReactNode
}


export default function Tooltip({ children, content }: TooltipProps) {
    return (
        <TooltipProvider>
            <ShadcnTooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {content}
                </TooltipContent>
            </ShadcnTooltip>
        </TooltipProvider>
    )
}
