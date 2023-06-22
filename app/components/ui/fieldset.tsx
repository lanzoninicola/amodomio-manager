import useFormSubmissionnState from "~/hooks/useFormSubmissionState";

interface FieldsetProps {
    children: React.ReactNode;
}

export default function Fieldset({ children }: FieldsetProps) {
    const formSubmissionState = useFormSubmissionnState()
    const formSubmissionInProgress = formSubmissionState === "submitting"

    return <fieldset className={`grid w-full max-w-sm md:max-w-lg items-center gap-1.5 mb-4 ${formSubmissionInProgress === true && "opacity-50"}`}>
        {children}
    </fieldset>
}