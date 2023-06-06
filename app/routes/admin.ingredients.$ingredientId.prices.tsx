import { Form, Link, useActionData, useOutletContext, useSearchParams } from "@remix-run/react";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import type { HttpResponse } from "~/utils/http-response.server";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { IngredientWithAssociations } from "~/domain/ingredient/ingredient.entity";
import { IngredientEntity } from "~/domain/ingredient/ingredient.entity";
import type { IngredientOutletContext, loader } from "./admin.ingredients.$ingredientId";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { useNavigation, useLoaderData } from "@remix-run/react";
import { Trash2, Save, PinOff, Edit } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { IngredientPrice } from "~/domain/ingredient/ingredient-price.model.server";
import { Switch } from "~/components/ui/switch";
import { TableRow, TableTitles, Table } from "~/components/primitives/table-list";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";
import { AlertError } from "~/components/layout/alerts/alerts";
import randomReactKey from "~/utils/random-react-key";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);
    const ingredientEntity = new IngredientEntity()


    if (_action === "ingredient-add-price") {

        const defaultPriceExists = await ingredientEntity.findPrices([
            { field: "ingredientId", op: "==", value: values.ingredientId },
            { field: "defaultPrice", op: "==", value: true }
        ]) as IngredientPrice[]

        if (defaultPriceExists.length >= 1) {
            return badRequest({ action: "ingredient-update-price", message: "Já existe um preço padrão para este ingrediente" })
        }

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

        const defaultPriceExists = await ingredientEntity.findPrices([
            { field: "ingredientId", op: "==", value: values.ingredientId },
            { field: "defaultPrice", op: "==", value: true },
            { field: "supplierId", op: "!=", value: values.supplierId },
        ]) as IngredientPrice[]

        if (defaultPriceExists.length >= 1) {
            return badRequest({ action: "ingredient-update-price", message: "Já existe um preço padrão para este ingrediente" })
        }

        const price = Number(values.price) ?? 0
        const quantity = Number(values.quantity) ?? 0
        const unitPrice = Number((price / quantity).toFixed(2))

        const [err, data] = await tryit(ingredientEntity.updatePrice(values.ingredientPriceId as string, {
            ingredientId: values.ingredientId as string,
            supplierId: values.supplierId as string,
            unit: values.unit as string,
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
            return badRequest({ action: "ingredient-delete-price", message: "Não foi possivel identificar o registro da apagar" })
        }

        const [err, data] = await tryit(ingredientEntity.deletePrice(values.ingredientPriceId as string))

        if (err) {
            return badRequest({ action: "ingredient-delete-price", message: errorMessage(err) })
        }

        return ok()
    }

    return null
}

export default function SingleIngredientPrices() {

    return (
        <div className="flex flex-col gap-8 h-full p-4">
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




    return (
        <Form className="flex">
            <Input type="hidden" name="id" value={ingredientPrice?.id} />
            <Fieldset>
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
            <Fieldset >
                <Select name="unit" defaultValue={ingredientPrice?.unit} required >
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
            <Fieldset >
                <Input name="quantity" defaultValue={ingredientPrice?.quantity} className="w-full" />
            </Fieldset>
            <Fieldset >
                <Input name="unit-price" readOnly defaultValue={ingredientPrice?.unitPrice} className="border-none w-full" />
            </Fieldset>
            <Fieldset >
                <Input name="price" defaultValue={ingredientPrice?.price} className="w-full" />
            </Fieldset>
            <Fieldset>
                <Label htmlFor="default-price">Preço padrão</Label>
                <Switch id="default-price" name="defaultPrice" defaultChecked={ingredientPrice?.defaultPrice === true ? true : false} />
            </Fieldset>
        </Form>

    )

}


function IngredientPriceList() {

    const context = useOutletContext<IngredientOutletContext>()
    const ingredient = context.ingredient as IngredientWithAssociations
    const ingredientPrices = ingredient.prices || []

    const formSubmissionState = useFormSubmissionnState()

    const actionData = useActionData<HttpResponse | null>()

    if (ingredientPrices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                    <PinOff size={64} />
                    <p className="text-2xl font-semibold text-gray-500">Nenhum preço cadastrado</p>
                </div>
            </div>
        )
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
                                    <Switch id="default-price" name="defaultPrice" defaultChecked={ingredientPrice.defaultPrice === true ? true : false} />

                                </TableRow>
                            </Form >
                        )
                    })
                )}
                <AlertError condition={(actionData && actionData?.status > 200) || false} title="Erro ao excluir o preço" message={(actionData && actionData.message) || ""} />
            </Table>
        </>
    )

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
