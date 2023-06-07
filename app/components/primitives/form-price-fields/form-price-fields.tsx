import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { useEffect, useState } from "react";
import toFixedNumber from "~/utils/to-fixed-number";

interface FormPriceFieldsProps {
    quantity?: number
    unitPrice?: number
    price?: number
}

export default function FormPriceFields({ quantity, unitPrice, price }: FormPriceFieldsProps) {


    const [stateQuantity, setStateQuantity] = useState(quantity || 1)
    const [statePrice, setStatePrice] = useState(price || 0)

    const derivedUnitPrice = unitPrice || toFixedNumber(statePrice / stateQuantity)

    useEffect(() => {
        setStateQuantity(quantity || 1)
        setStatePrice(price || 0)

    }, [quantity, price])
    console.table([{ quantity, price, unitPrice }, { stateQuantity, statePrice, derivedUnitPrice }])

    return (
        <>
            <Fieldset >
                <Label htmlFor="quantity">Quantitade</Label>
                <Input id="quantity" name="quantity" value={stateQuantity} className="max-w-[100px]" autoComplete="off" required
                    onChange={(e) => setStateQuantity(Number(e.target.value))}
                />
            </Fieldset>
            <Fieldset >
                <Label htmlFor="unit-price">Preço unitário</Label>
                <Input id="unit-price" name="unitPrice" readOnly value={derivedUnitPrice}
                    className="max-w-[100px] border-none w-full text-right text-muted-foreground" tabIndex={-1} autoComplete="off" required />
            </Fieldset>
            <Fieldset >
                <Label htmlFor="price">Preço</Label>
                <Input id="price" name="price" value={statePrice} className="max-w-[100px]" autoComplete="off"
                    onChange={(e) => setStatePrice(Number(e.target.value))}
                />
            </Fieldset>
        </>
    )
}