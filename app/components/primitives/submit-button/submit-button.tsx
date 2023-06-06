import { Loader, Save } from "lucide-react";
import type { ButtonProps } from "~/components/ui/button";
import { Button } from "~/components/ui/button";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";


interface SubmitButtonProps extends ButtonProps {
    actionName: string,
    loadingText?: string,
    idleText?: string

}

export default function SubmitButton({ actionName, loadingText, idleText }: SubmitButtonProps) {

    const formSubmissionState = useFormSubmissionnState()
    const formSubmissionInProgress = formSubmissionState === "inProgress"

    const loadingTextToDisplay = loadingText || "Salvando..."
    const idleTextToDisplay = idleText || "Salvar"

    return (
        <Button type="submit" name="_action" value={actionName} disabled={formSubmissionInProgress} className="flex gap-2">
            {formSubmissionInProgress ? <Loader size={16} /> : <Save size={16} />}
            {formSubmissionInProgress ? loadingTextToDisplay : idleTextToDisplay}
        </Button>
    )

}