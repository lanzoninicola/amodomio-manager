import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
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
import { type IngredientPrice, IngredientPriceModel } from "~/data-access/models/ingredient-price-model.server";
import { SupplierModel, type Supplier } from "~/data-access/models/supplier-model.server";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

export const meta: V2_MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

interface LoaderData {
    ingredients: Ingredient[]
    prices: IngredientPrice[]
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

    try {
        if (_action === "create-ingredient") {
            await IngredientModel.add({ name: values.name })
            return json(values.name)
        }

        if (_action === "ingredient-delete") {
            const foo = await IngredientModel.delete(values.id as string)
            return json({ success: true })
        }

        if (_action === "ingredient-add-price") {
            // await IngredientModel.addPrice({ id: values.id, price: 1.99 })
            return json({ success: true })
        }

    } catch (error) {
        return json({ error })
    }
}



export default function Index() {
    const loaderData: LoaderData = useLoaderData<typeof loader>()

    return (
        <Container>
            <div className="flex flex-col p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Ingredientes
                </h1>
                <Form method="post">
                    <Fieldset>
                        <Label htmlFor="ingredients-name">Nome</Label>
                        <Input type="string" id="ingredient-name" placeholder="Nome ingrediente" name="name" />
                    </Fieldset>
                    <Button type="submit" name="_action" value="create-ingredient">Salvar</Button>
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
                    {loaderData?.ingredients.length === 0 && (
                        <span>Nenhum ingrediente cadastrado</span>
                    )}
                    <IngredientList ingredients={loaderData.ingredients} prices={loaderData.prices} />
                </CardContent>
            </Card>

        </Container>
    )
}


function IngredientList({ ingredients, prices }: { ingredients: Ingredient[], prices: IngredientPrice[] }) {
    // Pressing "MoreHorizontal" button should be handled via SSR and not client-side
    const [showPriceForm, setShowPriceForm] = React.useState(true)

    return (
        <ul>
            {ingredients.map(ingredient => (
                <li key={ingredient.id} className="mb-4">
                    <Form method="delete" className="grid grid-cols-2 justify-between items-center" >
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
                    <IngredientPriceForm id={ingredient.id} priceRecord={prices.find(p => p.ingredientId === ingredient.id)} />
                    <Separator />
                </li>
            ))}
        </ul>
    )
}

function IngredientPriceForm({ id, priceRecord }: { id: string | undefined, priceRecord?: IngredientPrice }) {

    return <Form method="post">
        <Fieldset>
            <Label htmlFor="ingredients-name">Nome</Label>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Fieldset>


    </Form >
}
