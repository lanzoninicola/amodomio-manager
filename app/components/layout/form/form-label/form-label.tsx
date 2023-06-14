import { Label } from "~/components/ui/label"


interface FormLabelProps {
    disabled?: boolean
    clazzName?: React.StyleHTMLAttributes<HTMLLabelElement>["className"]
    children: React.ReactNode
}

export default function FormLabel({ disabled, children, clazzName, ...props }: FormLabelProps & React.ComponentPropsWithoutRef<typeof Label>) {

    const disabledClass = disabled ? "cursor-not-allowed opacity-70" : ""

    return (
        <Label {...props} className={`${disabledClass} ${props.className}`} >{children}</Label>
    )

}