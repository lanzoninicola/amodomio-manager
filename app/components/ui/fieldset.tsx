


interface FieldsetProps {
    children: React.ReactNode;
}

export default function Fieldset({ children }: FieldsetProps) {
    return <fieldset className="grid w-full max-w-sm md:max-w-lg items-center gap-1.5 mb-4">
        {children}
    </fieldset>
}