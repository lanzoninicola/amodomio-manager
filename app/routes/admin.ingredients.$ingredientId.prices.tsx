import { Form, Link, useOutletContext, useSearchParams } from "@remix-run/react";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { IngredientWithAssociations } from "~/domain/ingredient/ingredient.entity";
import { IngredientEntity } from "~/domain/ingredient/ingredient.entity";
import type { IngredientOutletContext } from "./admin.ingredients.$ingredientId";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { Trash2, PinOff, Edit, Eraser, Bird, PlusIcon, PlusSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { TableRow, TableTitles, Table } from "~/components/primitives/table-list";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";
import randomReactKey from "~/utils/random-react-key";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import toNumber from "~/utils/to-number";
import toFixedNumber from "~/utils/to-fixed-number";
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);
    const ingredientEntity = new IngredientEntity()

    const defaultPrice = values?.defaultPrice === "on" ? true : false

    if (_action === "ingredient-add-price") {

        const price = Number(values.price) ?? 0
        const quantity = Number(values.quantity) ?? 0
        const unitPrice = Number((price / quantity).toFixed(2))

        const [err, data] = await tryit(ingredientEntity.addPrice({
            ingredientId: values.ingredientId as string,
            supplierId: values.supplierId as string,
            unit: values.unit as string,
            quantity: quantity,
            price: price,
            unitPrice: unitPrice,
            defaultPrice: defaultPrice
        }))

        if (err) {
            return badRequest({ action: "ingredient-add-price", message: errorMessage(err) })
        }

        return ok()
    }

    if (_action === "ingredient-update-price") {

        const price = toNumber(values.price)
        const quantity = toNumber(values.quantity)
        const unitPrice = toFixedNumber(price / quantity)

        const [err, data] = await tryit(ingredientEntity.updatePrice(values.id as string, {
            ingredientId: values.ingredientId as string,
            supplierId: values.supplierId as string,
            unit: values.unit as string,
            quantity: quantity,
            unitPrice: unitPrice,
            price: price,
            defaultPrice: defaultPrice
        }))

        if (err) {
            return badRequest({ action: "ingredient-update-price", message: errorMessage(err) })
        }

        return ok()
    }

    if (_action === "ingredient-delete-price") {
        if (!values?.id) {
            return badRequest({ action: "ingredient-delete-price", message: "Não foi possivel identificar o registro da apagar" })
        }

        const [err, data] = await tryit(ingredientEntity.deletePrice(values.id as string))

        if (err) {
            return badRequest({ action: "ingredient-delete-price", message: errorMessage(err) })
        }

        return ok()
    }

    return null
}

export default function SingleIngredientPrices() {

    return (
        <div className="flex flex-col gap-8 h-full">
            <IngredientPriceEdit />
            <IngredientPriceList />
        </div>
    )
}

function IngredientPriceEdit() {
    const context = useOutletContext<IngredientOutletContext>()
    const ingredient = context.ingredient as IngredientWithAssociations
    const ingredientPrices = ingredient.prices || []

    const [searchParams, setSearchParams] = useSearchParams()
    const ingredientPriceId = searchParams.get("ingredientPriceId")
    const ingredientPrice = ingredientPrices.find(price => price.id === ingredientPriceId)

    const suppliers = context.suppliers || []

    const formActionSubmission = ingredientPrice?.id ? "ingredient-update-price" : "ingredient-add-price"

    let formTitle
    let submitButtonText
    let submitButtonLoadingText

    if (formActionSubmission === "ingredient-add-price") {
        submitButtonText = "Salvar"
        submitButtonLoadingText = "Salvando..."
        formTitle = "Novo preço"
    }

    if (formActionSubmission === "ingredient-update-price") {
        submitButtonText = "Atualizar"
        submitButtonLoadingText = "Atualizando..."
        formTitle = `Atualizar preço com ID: ${ingredientPrice?.id}`
    }

    const derivedUnitPrice = (ingredientPrice?.price || 0) / (ingredientPrice?.quantity || 1)

    return (
        <div className="md:p-8 md:border-2 rounded-lg border-muted">
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold">{formTitle}</h3>
                <Form method="post" >

                    <div className="grid md:grid-cols-2 grid-cols-1 md:grid-rows-1 grid-rows-2 items-center md:gap-4">
                        <div>
                            <Input type="hidden" name="id" defaultValue={ingredientPrice?.id} />
                            <Input type="hidden" name="ingredientId" defaultValue={ingredient.id} />
                            <Fieldset>
                                <Label htmlFor="supplierId">Forneçedor</Label>
                                <Select name="supplierId" defaultValue={ingredientPrice?.supplierId} required >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Forneçedor" className="text-xs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {suppliers.map(supplier => (
                                                supplier.id && <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Fieldset>
                        </div>

                        <div className="flex md:flex-row gap-2">
                            <Fieldset >
                                <Label htmlFor="unit">Unidade</Label>
                                <div className="max-w-[100px]">
                                    <Select name="unit" defaultValue={ingredientPrice?.unit || "gr"} required>
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
                                </div>
                            </Fieldset>
                            <Fieldset >
                                <Label htmlFor="quantity">Quantitade</Label>
                                <Input id="quantity" name="quantity" defaultValue={ingredientPrice?.quantity || 1} className="max-w-[100px]" autoComplete="off" required />
                            </Fieldset>
                            <Fieldset >
                                <Label htmlFor="unit-price">Preço unitário</Label>
                                <Input id="unit-price" name="unitPrice" readOnly defaultValue={ingredientPrice?.unitPrice || derivedUnitPrice}
                                    className="max-w-[100px] border-none w-full text-right text-muted-foreground" tabIndex={-1} autoComplete="off" />
                            </Fieldset>
                            <Fieldset >
                                <Label htmlFor="price">Preço</Label>
                                <Input id="price" name="price" defaultValue={ingredientPrice?.price || 1} className="max-w-[100px]" autoComplete="off" />
                            </Fieldset>
                        </div>

                    </div>
                    <Fieldset >
                        <div className="flex gap-16 items-center">
                            <Label htmlFor="default-price">Preço padrão</Label>
                            <Switch id="default-price" name="defaultPrice" defaultChecked={ingredientPrice?.defaultPrice} />
                        </div>
                    </Fieldset>
                    <div className="w-full flex gap-4 justify-end">
                        <Link to={`/admin/ingredients/${ingredient.id}/prices`}>
                            <Button type="button" variant={"outline"} size={"lg"} className="flex gap-4">
                                <PlusSquare size={16} />
                                Novo preço
                            </Button>
                        </Link>
                        <SubmitButton actionName={formActionSubmission} size={"lg"} className="w-full md:max-w-[150px] gap-2"
                            idleText={submitButtonText}
                            loadingText={submitButtonLoadingText}
                        />
                    </div>


                </Form>
            </div>
        </div>

    )

}





function IngredientPriceList() {

    const context = useOutletContext<IngredientOutletContext>()
    const ingredient = context.ingredient as IngredientWithAssociations
    const ingredientPrices = ingredient.prices || []

    const formSubmissionState = useFormSubmissionnState()

    if (ingredientPrices.length === 0) {
        return <NoRecordsFound text="Nenhum preço cadastrado" />
    }

    return (
        <>
            <Table>
                <TableTitles
                    clazzName="grid-cols-7"
                    titles={[
                        "Ações",
                        "Fornecedor",
                        "Unidade",
                        "Quantidade",
                        "Preço Unitário",
                        "Preço",
                        "Preço Padrão"

                    ]}
                />

                {ingredientPrices.length > 0 && (
                    ingredientPrices.map(ingredientPrice => {
                        return (
                            <Form method="post" key={ingredientPrice.id || randomReactKey()}>
                                <TableRow
                                    row={ingredient}
                                    showDateColumns={false}
                                    clazzName="grid-cols-7"
                                    isProcessing={formSubmissionState === "inProgress"}
                                >
                                    <div className="flex gap-2">
                                        <Button variant="destructive" type="submit" name="_action" value="ingredient-delete-price" size={"sm"} className="w-[40px]">
                                            <Trash2 size={16} />
                                        </Button>
                                        <Link to={`?ingredientPriceId=${ingredientPrice.id}`}>
                                            <Button type="button" size={"sm"} className="w-[40px]">
                                                <Edit size={16} />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div>
                                        <Input type="hidden" name="id" value={ingredientPrice.id} />
                                        <Input type="hidden" name="supplierId" value={ingredientPrice.supplierId} />
                                        <Input name="supplier-name" readOnly defaultValue={ingredientPrice.supplier?.name} className="border-none  w-full" />
                                    </div>
                                    <Input name="unit" readOnly defaultValue={ingredientPrice.unit} className="border-none  w-full" />
                                    <Input name="quantity" readOnly defaultValue={ingredientPrice.quantity} className="border-none  w-full" />
                                    <Input name="unit-price" readOnly defaultValue={ingredientPrice.unitPrice} className="border-none  w-full" />
                                    <Input name="price" readOnly defaultValue={ingredientPrice.price} className="border-none  w-full" />
                                    <Switch id="default-price" name="defaultPrice" checked={ingredientPrice.defaultPrice === true ? true : false} />

                                </TableRow>
                            </Form >
                        )
                    })
                )}
            </Table>
        </>
    )

}

