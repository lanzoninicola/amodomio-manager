import { Loader, Save } from "lucide-react";
import type { ButtonProps } from "~/components/ui/button";
import { Button } from "~/components/ui/button";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";


interface SubmitButtonProps extends ButtonProps {
    actionName: string,
    loadingText?: string,
    idleText?: string,
    disableLoadingAnimation?: boolean,
}

export default function SubmitButton({ actionName, loadingText, idleText, disableLoadingAnimation, ...props }: SubmitButtonProps) {

    const formSubmissionState = useFormSubmissionnState()
    let formSubmissionInProgress = formSubmissionState === "submitting"

    if (disableLoadingAnimation) {
        formSubmissionInProgress = false
    }

    let icon = formSubmissionInProgress ? <Loader className="text-md" /> : <Save size={20} strokeWidth="1.25px" />
    let text = formSubmissionInProgress ? (loadingText || "Salvando...") : (idleText || "Salvar")
    let disabled = formSubmissionInProgress || props.disabled


    return (
        <Button type="submit" name="_action" value={actionName} disabled={disabled} {...props} className={`flex gap-2 w-full md:max-w-max md:px-8 ${props.className}  `} >
            {icon}
            <span className="text-lg lg:text-md">
                {text}
            </span>
        </Button>
    )

}