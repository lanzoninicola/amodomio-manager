import { Bird } from "lucide-react";



interface NoRecordsFoundProps {
    text: string
    additionalInfo?: string
    clazzName?: string
}

export default function NoRecordsFound({ text, additionalInfo, clazzName, }: NoRecordsFoundProps) {
    return (
        <div className={`grid place-items-center m-4 ${clazzName}`}>
            <div className="flex flex-col items-center justify-center gap-4">
                <Bird size={64} strokeWidth={"1px"} className="hover:rotate-6" />
                <div className="flex flex-col items-center justify-center">
                    <h4 className="text-xl font-normal text-gray-500">{text}</h4>
                    {additionalInfo && <p className="text-sm font-normal text-muted-foreground">{additionalInfo}</p>}
                </div>
            </div>
        </div>
    )
}