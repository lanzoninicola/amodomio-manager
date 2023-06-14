import { Construction } from "lucide-react";



interface WorkInProgressProps {
    text?: string
    additionalInfo?: string
    clazzName?: string
}

export default function WorkInProgress({ text, additionalInfo, clazzName, }: WorkInProgressProps) {
    return (
        <div className={`grid place-items-center m-4 ${clazzName}`}>
            <div className="flex flex-col items-center justify-center gap-4">
                <Construction size={64} strokeWidth={"1px"} className="hover:rotate-6" />
                <div className="flex flex-col items-center justify-center">
                    <h4 className="text-xl font-normal text-gray-500">{text || "Estamos em obras. Desculpe o transtorno..."}</h4>
                    {additionalInfo && <p className="text-sm font-normal text-muted-foreground">{additionalInfo}</p>}
                </div>
            </div>
        </div>
    )
}