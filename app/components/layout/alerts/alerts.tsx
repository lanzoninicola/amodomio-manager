import { XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { useToast } from "~/components/ui/use-toast"


interface AlertWrapperProps {
    children: React.ReactNode
    timeout?: number
    clazzName?: string
    buttonClazzName?: string
}

function AlertWrapper({ children, timeout, clazzName, buttonClazzName }: AlertWrapperProps) {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const t = setTimeout(() => {
            setShow(false)
        }, timeout || 30000)

        return () => clearTimeout(t)

    }, [timeout])

    if (show === false) return null

    return (
        <div className="fixed bottom-2 left-[50%] translate-x-[-50%] md:min-w-[400px] w-full md:w-auto " data-element="alert-wrapper">
            <div className={`relative flex flex-col items-end pb-4 md:pb-0 md:flex-row md:gap-8 md:items-center pr-4 md:pr-8 rounded-lg m-2 md:m-0 ${clazzName}`}>
                {/* <XCircle className="absolute top-4 right-4 h-4 w-4 cursor-pointer z-10" onClick={() => setShow(false)} /> */}
                {children}
                <Button type="button" variant="outline" size="sm" className={`flex gap-4 text-white ${buttonClazzName}`} onClick={() => setShow(false)}>
                    <XCircle size={16} />
                    Fechar
                </Button>
            </div>
        </div>
    )



}

interface AlertProps {
    title?: string
    message: string
    duration?: number
}

export function AlertError({ title, message, duration = 8000 }: AlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [duration]);

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed bottom-2 right-2">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <div className="flex flex-col gap-2">
                    <strong className="font-semibold">{title || "Erro!"}</strong>
                    <span className="block sm:inline">{message}</span>
                </div>
            </div>
        </div>
    );
}


export function AlertOk({ title, message, duration = 8000 }: AlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [duration]);

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed bottom-2 md:bottom-4 right-2 md:right-4 bg-white">
            <div className="shadow-md shadow-muted px-4 py-3 rounded relative" role="alert">
                <div className="flex flex-col gap-2">
                    <strong className="font-semibold">{title || "Ok!"}</strong>
                    <span className="block sm:inline">{message || "Operação concluida com successo"}</span>
                </div>
            </div>
        </div>
    );
}
