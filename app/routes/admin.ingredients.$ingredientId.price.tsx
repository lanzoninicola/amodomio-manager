import { Form, useOutletContext } from "@remix-run/react";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { IngredientWithAssociations } from "~/domain/ingredient/ingredient.entity";
import type { IngredientOutletContext } from "./admin.ingredients.$ingredientId";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@radix-ui/react-select";
import { useNavigation, useSearchParams, useLoaderData } from "@remix-run/react";
import { Trash2, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { IngredientPrice } from "~/domain/ingredient/ingredient-price.model.server";
import { IngredientPriceModel } from "~/domain/ingredient/ingredient-price.model.server";
import { Switch } from "~/components/ui/switch";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);


    if (_action === "ingredient-add-price") {

        const defaultPriceExists = await IngredientPriceModel.whereCompound([
            { field: "ingredientId", op: "==", value: values.ingredientId },
            { field: "defaultPrice", op: "==", value: true }
        ]) as IngredientPrice[]

        if (defaultPriceExists.length >= 1) {
            return badRequest({ action: "ingredient-update-price", message: "Já existe um preço padrão para este ingrediente" })
        }

        const price = Number(values.price) ?? 0
        const quantity = Number(values.quantity) ?? 0
        const unitPrice = (price / quantity).toFixed(2)

        const [err, data] = await tryit(IngredientPriceModel.add({
            ingredientId: values.ingredientId,
            supplierId: values.supplierId,
            unit: values.unit,
            quantity: quantity,
            price: price,
            unitPrice: unitPrice,
            defaultPrice: values.defaultPrice === "on" ? true : false
        }))

        if (err) {
            return badRequest({ action: "ingredient-add-price", message: errorMessage(err) })
        }

        return ok()
    }

    if (_action === "ingredient-update-price") {
        if (!values.ingredientPriceId) {
            return badRequest({ action: "ingredient-update-price", message: "Não foi possivel identificar o registro da atualizar" })
        }

        const defaultPriceExists = await IngredientPriceModel.whereCompound([
            { field: "ingredientId", op: "==", value: values.ingredientId },
            { field: "defaultPrice", op: "==", value: true },
            { field: "supplierId", op: "!=", value: values.supplierId },
        ]) as IngredientPrice[]

        if (defaultPriceExists.length >= 1) {
            return badRequest({ action: "ingredient-update-price", message: "Já existe um preço padrão para este ingrediente" })
        }

        const price = Number(values.price) ?? 0
        const quantity = Number(values.quantity) ?? 0
        const unitPrice = (price / quantity).toFixed(2)

        const [err, data] = await tryit(IngredientPriceModel.update(values.ingredientPriceId as string, {
            ingredientId: values.ingredientId,
            supplierId: values.supplierId,
            unit: values.unit,
            quantity: quantity,
            price: price,
            unitPrice: unitPrice,
            defaultPrice: values.defaultPrice === "on" ? true : false
        }))

        if (err) {
            return badRequest({ action: "ingredient-update-price", message: errorMessage(err) })
        }

        return ok()
    }

    if (_action === "ingredient-delete-price") {
        if (!values.ingredientPriceId) {
            return badRequest({ action: "ingredient-update-price", message: "Não foi possivel identificar o registro da apagar" })
        }

        const [err, data] = await tryit(IngredientPriceModel.delete(values.ingredientPriceId as string))

        if (err) {
            return badRequest({ action: "ingredient-delete-price", message: errorMessage(err) })
        }

        return ok()
    }

    return null
}

export default function SingleIngredientPrices() {

    const context = useOutletContext<IngredientOutletContext>()
    const ingredient = context.ingredient as IngredientWithAssociations
    const ingredientId = ingredient.id as string
    const ingredientPrices = ingredient.prices || []


    return (
        <ul className="md:p-4">
            {ingredientPrices.length > 0 && (
                ingredientPrices.map(ingredientPrice => {

                    if (ingredientPrice.ingredientId === undefined) return null

                    return (
                        <li key={ingredientPrice.id || Math.random().toString(32).slice(2)}>
                            <IngredientPriceForm
                                ingredientPriceId={ingredientPrice.id}
                                ingredientId={ingredientPrice.ingredientId}
                                supplierId={ingredientPrice.supplierId}
                                unit={ingredientPrice.unit}
                                quantity={ingredientPrice.quantity}
                                price={ingredientPrice.price}
                                isDefault={ingredientPrice.defaultPrice}
                            />
                        </li>
                    )
                }))
            }
            <li key={Math.random().toString(32).slice(2)}>
                <IngredientPriceForm
                    ingredientPriceId={undefined}
                    ingredientId={ingredientId}
                    supplierId={undefined}
                    unit={undefined}
                    quantity={undefined}
                    price={undefined}
                    isDefault={false}
                />
            </li>
        </ul>
    )

}


interface IngredientPriceFormProps {
    ingredientPriceId?: string
    ingredientId: string
    supplierId?: string
    unit?: string
    quantity?: number
    price?: number
    isDefault?: boolean
}

function IngredientPriceForm({ ingredientPriceId, ingredientId, supplierId, unit, quantity, price, isDefault }: IngredientPriceFormProps) {
    const navigation = useNavigation();
    const loaderData = useLoaderData<typeof loader>()

    // all suppliers
    const suppliers = loaderData.suppliers

    const formActionSubmission = ingredientPriceId ? "ingredient-update-price" : "ingredient-add-price"

    const isDisabledDeleteSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"
    const isDisabledSaveSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"

    return (

        <Form method="post" className="mb-2">
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center md:flex md:flex-row-reverse w-full md:items-start">

                <div className="flex flex-col gap-2 md:flex-row-reverse h-[120px] md:h-auto">
                    <Button type="submit" name="_action" value={formActionSubmission} disabled={isDisabledSaveSubmissionButton} size="sm" ><Save size={16} /></Button>
                    <Button type="submit" variant="destructive" name="_action" value={"ingredient-delete-price"} disabled={isDisabledDeleteSubmissionButton} size="sm"><Trash2 size={16} /></Button>
                </div>
                <div className="mb-4 w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col w-full md:flex-row gap-2">
                            <Input type="hidden" name="ingredientPriceId" value={ingredientPriceId} />
                            <Input type="hidden" name="ingredientId" value={ingredientId} />
                            <Fieldset>
                                <Select name="supplierId" defaultValue={supplierId} required >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Forneçedor" className="text-xs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {suppliers.map(supplier => (
                                                <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Fieldset>

                            <div className="flex gap-2">
                                <Fieldset >
                                    <Select name="unit" defaultValue={unit} required >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup >
                                                <SelectItem value="gr">GR</SelectItem>
                                                <SelectItem value="un">UN</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Fieldset>
                                <Fieldset>
                                    <Input type="number" id="ingredient-quantity" required placeholder="Quantitade" name="quantity" className="md:w-[100px]" defaultValue={quantity} />
                                </Fieldset>
                                <Fieldset>
                                    <Input type="number" id="ingredient-price" required placeholder="Preço" name="price" className="md:w-[100px]" defaultValue={price} />
                                </Fieldset>

                            </div>

                        </div>
                        <div className="flex justify-between">
                            <Label htmlFor="default-price-mode" className="text-sm">Esse é o preço preferençial</Label>
                            <Switch id="default-price" name="defaultPrice" defaultChecked={isDefault === true ? true : false} />
                        </div>
                    </div>
                </div>


            </div>
        </Form>
    )
}
