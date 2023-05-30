import { AlertCircle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"


interface AlertWrapperProps {
    children: React.ReactNode
    timeout?: number
}

function AlertWrapper({ children, timeout }: AlertWrapperProps) {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const t = setTimeout(() => {
            setShow(false)
        }, timeout || 405000)

        return () => clearTimeout(t)

    }, [timeout])

    if (show === false) return null


    return (

        <div className="fixed bottom-2 left-[50%] translate-x-[-50%] p-4 md:min-w-[400px] w-full md:w-auto">
            <div className="relative">
                <XCircle className="absolute top-4 right-4 h-4 w-4 cursor-pointer z-10" onClick={() => setShow(false)} />
                {children}
            </div>
        </div>

    )



}

interface AlertErrorProps {
    title?: string
    message?: string
    timeout?: number
}

export function AlertError({ title, message, timeout }: AlertErrorProps) {
    return (
        <AlertWrapper timeout={timeout}>

            <Alert className="bg-red-500">
                <div className="flex gap-2 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{`Erro: ${title}` || "Erro"}</AlertTitle>
                </div>
                <AlertDescription>
                    {message || "Um erro ocorreu, tente novamente mais tarde."}
                </AlertDescription>
            </Alert>

        </AlertWrapper>
    )
}
