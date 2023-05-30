import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useTransition } from "@remix-run/react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { IngredientModel, type Ingredient } from "~/data-access/models/ingredient-model.server";
import { IngredientPriceModel, type TIngredientPriceModel } from "~/data-access/models/ingredient-price-model.server";
import { SupplierModel, type Supplier } from "~/data-access/models/supplier-model.server";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

import errorMessage from "~/lib/error-message";
import { badRequest, ok } from "~/lib/api-response";
import tryit from "~/lib/try-it";
import { AlertError } from "~/components/layout/alerts/alerts";

export const meta: V2_MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

interface LoaderData {
    ingredients: Ingredient[]
    prices: TIngredientPriceModel[]
    suppliers: Supplier[]
}

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
    const loaderData: LoaderData = useLoaderData<typeof loader>()
    // Pressing "MoreHorizontal" button should be handled via SSR and not client-side
    const [showPriceForm, setShowPriceForm] = React.useState(true)

    if (!loaderData.ingredients || loaderData.ingredients.length === 0) return null

    return (
        <ul>
            {loaderData.ingredients.map(ingredient => (
                <li key={ingredient.id} className="mb-4">
                    <Form method="delete" className="grid grid-cols-2 justify-between items-center mb-2" >
                        <div>
                            <Input type="hidden" name="id" value={ingredient.id} />
                            <p>{ingredient.name}</p>
                        </div>
                        <div className="flex justify-end gap-2 md:gap-4 mb-2">
                            <Button variant="destructive" size="sm" type="submit" name="_action" value="ingredient-delete">
                                <Trash2 size={16} />
                            </Button>
                            <Button size="sm" onClick={() => setShowPriceForm(!showPriceForm)}>
                                <MoreHorizontal size={16} />
                            </Button>
                        </div>
                    </Form>
                    {showPriceForm && <IngredientPriceForm id={ingredient.id} />}
                    <Separator />
                </li>
            ))}
        </ul>
    )
}

function IngredientPriceForm({ id }: { id: string | undefined }) {
    const navigation = useNavigation();
    const loaderData: LoaderData = useLoaderData<typeof loader>()

    // all prices for all ingredients
    const ingredientsPrices = loaderData.prices
    // all ingredients
    const ingredients = loaderData.ingredients
    // all suppliers
    const suppliers = loaderData.suppliers

    // Get the first price for this ingredient (if any)
    const ingredientPrice = ingredientsPrices.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1).find(p => p.ingredientId === id)
    // Get the ingredient for this price
    const ingredient = ingredients.find(i => i.id === ingredientPrice?.ingredientId)

    const formActionSubmission = ingredientPrice ? "ingredient-update-price" : "ingredient-add-price"



    return (
        <Form method="post" className="mb-4">

            <Input type="hidden" name="ingredientId" value={ingredient?.id} />
            <Input type="hidden" name="ingredientPriceId" value={ingredientPrice?.id} />
            <div className="flex flex-col md:flex-row md:gap-4">
                <Fieldset>
                    <Select name="supplierId" defaultValue={ingredientPrice && ingredientPrice.supplierId} >
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
                <div className="flex gap-4">
                    <Fieldset>
                        <Select name="unit" defaultValue={ingredientPrice && ingredientPrice.unit} >
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
                        <Input type="number" id="ingredient-quantity" placeholder="Quantitade" name="quantity" className="md:w-[100px]" defaultValue={ingredientPrice && ingredientPrice.quantity} />
                    </Fieldset>
                    <Fieldset>
                        <Input type="number" id="ingredient-price" placeholder="Preço" name="price" className="md:w-[100px]" defaultValue={ingredientPrice && ingredientPrice.price} />
                    </Fieldset>
                </div>
            </div>
            <Button type="submit" name="_action" value={formActionSubmission} className="w-full" disabled={navigation.state === "submitting" || navigation.state === "loading"}>Salvar</Button>
        </Form >)
}
