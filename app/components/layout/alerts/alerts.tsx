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
    message?: string
    timeout?: number
}

export function AlertError({ title, message, timeout }: AlertProps) {

    const { toast } = useToast()

    useEffect(() => {
        toast({
            variant: "destructive",
            title: title || "Erro",
            description: message || "Um erro ocorreu, tente novamente mais tarde.",
            duration: timeout || 5000,
        })

    }, [message, timeout, title, toast])

    return null
}


export function AlertOk({ title, message, timeout }: AlertProps) {

    const { toast } = useToast()

    useEffect(() => {
        toast({
            title: title || "Ok",
            description: message || "Operação realizada com sucesso.",
            duration: timeout || 5000,
        })

    }, [message, timeout, title, toast])

    return null


}
