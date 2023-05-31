import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Delete, MoreHorizontal, Plus, Save, SaveIcon, Trash, Trash2 } from "lucide-react";
import React, { useState } from "react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { IngredientModel } from "~/data-access/models/ingredient-model.server";
import type { TIngredientPriceModel } from "~/data-access/models/ingredient-price-model.server";
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

    console.log({ _action, values })

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
        const [err, data] = await tryit(IngredientPriceModel.add({
            ingredientId: values.ingredientId,
            supplierId: values.supplierId,
            unit: values.unit,
            quantity: values.quantity,
            price: values.price,
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

        const [err, data] = await tryit(IngredientPriceModel.update(values.ingredientPriceId as string, {
            ingredientId: values.ingredientId,
            supplierId: values.supplierId,
            unit: values.unit,
            quantity: values.quantity,
            price: values.price,
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

    console.log({ responseData, navigation })



    return (
        <Container>
            <div className="flex flex-col p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Ingredientes
                </h1>
                <Form method="post" >
                    <Fieldset>
                        <Label htmlFor="ingredients-name">Nome</Label>
                        <Input type="string" id="ingredient-name" placeholder="Nome ingrediente" name="name" required />
                    </Fieldset>
                    <Button type="submit" name="_action" value="create-ingredient" disabled={navigation.state === "submitting" || navigation.state === "loading"}>
                        Salvar
                    </Button>
                </Form>

            </div>

            <Card className="mx-4 md:mx-8">
                <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle>Lista ingredientes</CardTitle>

                        <Link to={`?showPrices="true"`}>
                            <span>Visualizar preços</span>
                        </Link>
                    </div>
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
    const loaderData = useLoaderData<typeof loader>()
    // all prices for all ingredients
    const ingredientsPrices = loaderData.prices
    // prices for this ingredient
    const ingredientPrices: IngredientPrice[] = ingredientsPrices.filter(price => price.ingredientId === ingredient.id)

    const [prices, setPrices] = useState<Partial<IngredientPrice>[]>(ingredientPrices)


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
                    <Button type="button" size="sm" onClick={() => {

                        if (ingredient.id === undefined) return

                        setPrices([...prices, {
                            ingredientId: ingredient.id,
                        }])
                    }}>
                        <Plus size={16} />
                    </Button>
                </div>
            </Form>
            {prices.length > 0 && (
                prices.map(ingredientPrice => {

                    if (ingredientPrice.ingredientId === undefined) return null

                    return <IngredientPriceForm
                        key={ingredientPrice.id}
                        ingredientPriceId={ingredientPrice.id}
                        ingredientId={ingredientPrice.ingredientId}
                        supplierId={ingredientPrice.supplierId}
                        unit={ingredientPrice.unit}
                        quantity={ingredientPrice.quantity}
                        price={ingredientPrice.price}

                    />
                }))
            }
            <Separator />
        </>
    )
}

interface IngredientPriceFormProps {
    ingredientPriceId?: string
    ingredientId: string
    supplierId?: string
    unit?: string
    quantity?: number
    price?: number
}

function IngredientPriceForm({ ingredientPriceId, ingredientId, supplierId, unit, quantity, price }: IngredientPriceFormProps) {
    const navigation = useNavigation();
    const loaderData = useLoaderData<typeof loader>()
    // all suppliers
    const suppliers = loaderData.suppliers
    // supplier for this ingredient
    const supplier = suppliers.find(supplier => supplier.id === supplierId)

    const formActionSubmission = ingredientPriceId ? "ingredient-update-price" : "ingredient-add-price"

    const isDisabledDeleteSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"
    const isDisabledSaveSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"

    return (

        <Form method="post">
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center md:flex md:flex-row-reverse w-full md:items-start">
                <div className="flex flex-col gap-2 md:flex-row-reverse">
                    <Button type="submit" name="_action" value={formActionSubmission} disabled={isDisabledSaveSubmissionButton} size="sm"><Save size={16} /></Button>
                    <Button type="submit" name="_action" value={"ingredient-delete-price"} variant="destructive" disabled={isDisabledDeleteSubmissionButton} size="sm"><Trash2 size={16} /></Button>
                </div>
                <div className="flex flex-col w-full md:flex-row gap-2">
                    <Input type="hidden" name="ingredientPriceId" value={ingredientId} />
                    <Input type="hidden" id="supplierId" name="supplierId" defaultValue={supplierId} />
                    <Fieldset>
                        <Input type="text" id="ingredient-supplier-name" placeholder="Forneçedor" name="supplierName" defaultValue={supplier?.name} />
                    </Fieldset>
                    <div className="flex gap-2">
                        <Fieldset >
                            <Select name="unit" defaultValue={unit} >
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
                            <Input type="number" id="ingredient-quantity" placeholder="Quantitade" name="quantity" className="md:w-[100px]" defaultValue={quantity} />
                        </Fieldset>
                        <Fieldset>
                            <Input type="number" id="ingredient-price" placeholder="Preço" name="price" className="md:w-[100px]" defaultValue={price} />
                        </Fieldset>

                    </div>
                </div>

            </div>
        </Form>
    )
}
