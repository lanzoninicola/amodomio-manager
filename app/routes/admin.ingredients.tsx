import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { MoreHorizontal, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { IngredientModel } from "~/data-access/models/ingredient-model.server";
import { IngredientPriceModel } from "~/data-access/models/ingredient-price-model.server";
import { SupplierModel } from "~/data-access/models/supplier-model.server";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

import errorMessage from "~/lib/error-message";
import { badRequest, ok } from "~/lib/api-response";
import tryit from "~/lib/try-it";
import { AlertError } from "~/components/layout/alerts/alerts";
import type { IngredientPrice } from "~/data-access/models/ingredient-price-model.server";
import type { Ingredient } from "~/data-access/models/ingredient-model.server";
import { X } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { SupplierCombobox } from "./resources.suppliers";
import { SupplierInput } from "./resources.supplier";
import SearchableInput from "~/components/layout/searchable-input/searchable-input";

export const meta: V2_MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};



export async function loader() {
    const ingredients = await IngredientModel.findAll()
    const ingredientsPrices = await IngredientPriceModel.findAll()
    const suppliers = await SupplierModel.findAll()

    return json({ ingredients, prices: ingredientsPrices, suppliers })
}

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "create-ingredient") {

        const [err, data] = await tryit(IngredientModel.add({ name: values.name }))

        if (err) {
            return badRequest({ action: "create-ingredient", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Ingrediente criado com sucesso" })
    }

    if (_action === "ingredient-delete") {
        const [err, data] = await tryit(IngredientModel.delete(values.id as string))

        if (err) {
            return badRequest({ action: "ingredient-delete", message: errorMessage(err) })
        }

        return ok()
    }

    if (_action === "ingredient-add-price") {

        const defaultPriceExists = await IngredientPriceModel.whereCompound([
            { field: "ingredientId", op: "==", value: values.ingredientId },
            { field: "defaultPrice", op: "==", value: true }
        ]) as IngredientPrice[]

        if (defaultPriceExists.length >= 1) {
            return badRequest({ action: "ingredient-update-price", message: "Já existe um preço padrão para este ingrediente" })
        }

        const [err, data] = await tryit(IngredientPriceModel.add({
            ingredientId: values.ingredientId,
            supplierId: values.supplierId,
            unit: values.unit,
            quantity: values.quantity,
            price: values.price,
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

        const [err, data] = await tryit(IngredientPriceModel.update(values.ingredientPriceId as string, {
            ingredientId: values.ingredientId,
            supplierId: values.supplierId,
            unit: values.unit,
            quantity: values.quantity,
            price: values.price,
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



export default function Index() {
    const navigation = useNavigation();
    // navigation.state; // "idle" | "submitting" | "loading"
    const responseData = useActionData<typeof action>();

    let [searchParams, setSearchParams] = useSearchParams();
    const ingredientAction = searchParams.get("action")



    return (
        <Container>
            <div className="flex flex-col p-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">
                        Ingredientes
                    </h1>
                    <Link to={`?action=new`}>
                        <Button type="button" className="flex gap-2">
                            <Plus size={16} />
                            Novo Ingrediente
                        </Button>
                    </Link>
                </div>
                {ingredientAction === "new" && <Card>
                    <CardHeader>
                        <CardTitle>Novo Ingrediente</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <Form method="post" >
                            <Fieldset>
                                <Label htmlFor="ingredients-name">Nome</Label>
                                <Input type="string" id="ingredient-name" placeholder="Nome ingrediente" name="name" required />
                            </Fieldset>
                            <div className="flex gap-2">
                                <Button type="submit" name="_action" value="create-ingredient" disabled={navigation.state === "submitting" || navigation.state === "loading"}>
                                    Salvar
                                </Button>
                                <Button type="button" variant={"outline"} className="border-2 border-black hover:border-[inherit]" disabled={navigation.state === "submitting" || navigation.state === "loading"}
                                    onClick={() => setSearchParams(new URLSearchParams())}>
                                    Fechar
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>}

            </div>

            <Card className="mx-4 md:mx-8">
                <CardHeader>
                    <CardTitle>Lista ingredientes</CardTitle>
                    <CardDescription>
                        Lista de ingredientes cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <IngredientList />
                </CardContent>
            </Card>

            {responseData && responseData?.status >= 400 && (
                <AlertError title={responseData?.action} message={responseData?.message} />)}
        </Container>
    )
}


function IngredientList() {
    const loaderData = useLoaderData<typeof loader>()
    if (!loaderData.ingredients || loaderData.ingredients.length === 0) return null

    return (
        <ul>
            {loaderData.ingredients.map(ingredient => {
                return (
                    <li key={ingredient.id} className="mb-4">
                        <IngredientItem ingredient={ingredient} />

                    </li>
                )
            })}
        </ul>
    )
}


function IngredientItem({ ingredient }: { ingredient: Ingredient }) {
    let [searchParams, _] = useSearchParams();
    const activeIngredientId = searchParams.get("id")
    const activeTab = searchParams.get("tab")

    const activeTabStyle = "bg-primary text-white rounded-md py-1"

    return (
        <>
            <Form method="delete" className="grid grid-cols-2 justify-between items-center mb-2" >
                <div>
                    <Input type="hidden" name="id" value={ingredient.id} />
                    <p>{ingredient.name}</p>
                </div>
                <div className="flex justify-end gap-2 md:gap-4 mb-2">
                    <Button variant="destructive" size="sm" type="submit" name="_action" value="ingredient-delete">
                        <Trash2 size={16} />
                    </Button>

                    <Link to={`?id=${ingredient.id}&tab=prices`}>
                        <Button type="button" size="sm">
                            {activeIngredientId === ingredient.id ? <X size={16} /> : <MoreHorizontal size={16} />}
                        </Button>
                    </Link>
                </div>
            </Form>
            {activeIngredientId === ingredient.id && (
                <>
                    <div className="grid grid-cols-2 h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-4">
                        <Link to={`?id=${ingredient.id}&tab=prices`} className="w-full text-center">
                            <div className={`${activeTab === "prices" && activeTabStyle} ${activeTab}`}>
                                <span>Preços</span>
                            </div>

                        </Link >
                        <Link to={`?id=${ingredient.id}&tab=stock`} className="w-full text-center">
                            <div className={`${activeTab === "stock" && activeTabStyle}`}>
                                <span>Armazenamento</span>
                            </div>
                        </Link>
                    </div >

                    {activeTab === "prices" && (<IngredientPriceList />)}

                </>
            )}


            <Separator />
        </>
    )
}


function IngredientPriceList() {
    let [searchParams, setSearchParams] = useSearchParams();
    const ingredientId = searchParams.get("id") as string

    const loaderData = useLoaderData<typeof loader>()
    // all prices for all ingredients
    const ingredientsPrices = loaderData.prices

    const ingredientPrices: IngredientPrice[] = ingredientsPrices.filter(price => price.ingredientId === ingredientId)

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
