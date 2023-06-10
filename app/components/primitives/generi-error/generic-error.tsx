import { CloudOff } from "lucide-react";


interface GenericErrorProps {
    text?: string
    message?: string
}


export default function GenericError({ text, message }: GenericErrorProps) {
    return (
        <div className="grid place-items-center m-4">
            <div className="flex flex-col items-center justify-center gap-4">
                <CloudOff size={64} strokeWidth={"1px"} className="hover:rotate-6" color="red" />
                <p className="text-xl font-normal text-red-500">{text || "Erro generico"}</p>
                {message && <p className="text-md font-normal text-red-300">{message}</p>}
            </div>
        </div>
    )
}