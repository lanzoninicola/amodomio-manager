import { useNavigate } from "@remix-run/react"
import { useState, useEffect } from "react"

interface EasterEggProps {
    children: React.ReactNode
    timeBeforeRedirect?: number
    redirectTo: string
    redirectSentence?: string
    amountOfClicks?: number
}

export default function EasterEgg({
    children,
    timeBeforeRedirect = 1500,
    redirectTo,
    redirectSentence = "Aguarde...",
    amountOfClicks = 3
}: EasterEggProps) {
    const navigate = useNavigate()
    const [clickedAmount, setClickedAmount] = useState(0)
    const [showRedirect, setShowRedirect] = useState(false)

    console.log('clickedAmount', clickedAmount)

    const handleClick = () => {
        setClickedAmount(clickedAmount + 1)
    }

    const isClickedEnough = clickedAmount > amountOfClicks


    useEffect(() => {
        let timeout: NodeJS.Timeout

        if (isClickedEnough) {
            setShowRedirect(true)

            timeout = setTimeout(() => {
                navigate(redirectTo)
            }, timeBeforeRedirect)

            return () => {
                clearTimeout(timeout)
            }

        }
    }, [isClickedEnough, navigate, redirectTo, timeBeforeRedirect])

    if (showRedirect) {

        return (
            <div className="grid place-items-center">
                <span className="font-semibold text-sm">{redirectSentence}</span>
            </div>
        )
    }

    return (
        <div onClick={handleClick} >
            {children}
        </div>
    )
}