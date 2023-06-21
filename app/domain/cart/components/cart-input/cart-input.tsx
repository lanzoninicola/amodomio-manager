import React from "react"
import { type InputProps } from "~/components/ui/input"
import { cn } from "~/lib/utils"



const CartInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-brand-green border-muted-foreground text-xl p-6",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
CartInput.displayName = "CartInput"


const PhoneCartInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {

        const [value, setValue] = React.useState(props.defaultValue ?? "")

        return (
            <CartInput
                type="tel"
                name="phone"
                className={cn(
                    "max-w-[200px] tracking-wider",
                    className
                )}
                ref={ref}
                onChange={(e) => {
                    const { value } = e.target
                    const phone = value.replace(/\D/g, "")
                    setValue(phone)
                }}
                value={value}
                autoComplete="nope"
                {...props}
            />
        )
    }
)
PhoneCartInput.displayName = "PhoneCartInput"

export { CartInput, PhoneCartInput }