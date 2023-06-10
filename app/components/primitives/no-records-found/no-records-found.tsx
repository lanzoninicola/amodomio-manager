import { Bird } from "lucide-react";


export default function NoRecordsFound({ text }: { text: string }) {
    return (
        <div className="grid place-items-center m-4">
            <div className="flex flex-col items-center justify-center gap-4">
                <Bird size={64} strokeWidth={"1px"} className="hover:rotate-6" />
                <p className="text-xl font-normal text-gray-500">{text}</p>
            </div>
        </div>
    )
}