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
    let formSubmissionInProgress = formSubmissionState === "inProgress"

    if (disableLoadingAnimation) {
        formSubmissionInProgress = false
    }

    console.log(props.disabled)

    let icon = formSubmissionInProgress ? <Loader className="text-md" /> : <Save size={20} strokeWidth="1.25px" />
    let text = formSubmissionInProgress ? "Salvando..." : "Salvar"
    let disabled = formSubmissionInProgress || props.disabled

    return (
        <Button type="submit" name="_action" value={actionName} disabled={disabled} {...props} className={`flex gap-2 w-full md:w-[150px] ${props.className}  `} >
            {icon}
            <span className="text-lg lg:text-md">
                {text}
            </span>
        </Button>
    )

}