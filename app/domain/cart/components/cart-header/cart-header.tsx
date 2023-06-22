import { LogoTransparent } from "~/components/primitives/logo/logo"



interface CartHeaderProps {
    children?: React.ReactNode
}

export default function CartHeader({ children }: CartHeaderProps) {

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-[120px] md:h-[150px]">
            <LogoTransparent clazzName="mb-2 md:mb-4" />
            {children}
        </div>
    )
}