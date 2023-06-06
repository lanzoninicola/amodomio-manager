import { AlertCircle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import randomReactKey from "~/utils/random-react-key"


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

interface AlertErrorProps {
    title?: string
    message?: string
    condition: boolean
    timeout?: number
}

export function AlertError({ condition, title, message, timeout }: AlertErrorProps) {

    // using randomReactKey to force the component to re-render

    if (condition === false) return null

    return (
        <AlertWrapper key={randomReactKey()} timeout={timeout} clazzName="bg-red-500" >
            <Alert className="bg-red-500 border-red-500">
                <div className="flex gap-2 mb-2 items-center">
                    <AlertCircle className="h-4 w-4" color="white" />
                    <AlertTitle className="text-white font-semibold text-lg mb-0">{`Erro: ${title}` || "Erro"}</AlertTitle>
                </div>
                <AlertDescription className="text-white">
                    {message || "Um erro ocorreu, tente novamente mais tarde."}
                </AlertDescription>
            </Alert>
        </AlertWrapper>
    )
}
