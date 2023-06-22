import { Form } from "@remix-run/react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

interface SortingOrderProps {
    itemId?: string
    groupId?: string
    enabled: boolean
    children: React.ReactNode
}

export default function SortingOrderItems({ enabled, itemId, groupId, children }: SortingOrderProps) {

    if (enabled === false) return <>{children}</>

    return (
        <div className="grid grid-cols-[1fr_.15fr] gap-2">
            <div>
                {children}
            </div>
            <Form method="post">
                <Input type="hidden" name="id" defaultValue={itemId} />
                <Input type="hidden" name="groupId" defaultValue={groupId} />
                <div className="grid grid-rows-2 gap-2">
                    <Button type="submit" variant="ghost" name="_action" value="item-sortorder-up" className="w-full">
                        <div className="bg-muted flex items-center justify-center rounded-md p-2">
                            <ArrowUp size={24} className="cursor-pointer" />
                        </div>
                    </Button>
                    <Button type="submit" variant="ghost" name="_action" value="item-sortorder-down" className="w-full">
                        <div className="bg-muted flex items-center justify-center rounded-md p-2">
                            <ArrowDown size={24} className="cursor-pointer" />
                        </div>
                    </Button>
                </div>
            </Form>
        </div>
    )

}