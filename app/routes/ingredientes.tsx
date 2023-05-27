import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { IngredientModel, type Ingredient } from "~/data-access/models/ingredient-model.server";

export const meta: V2_MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function loader() {
    const ingredients = await IngredientModel.findAll()

    return json(ingredients)
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
    const loaderData: Ingredient[] = useLoaderData<typeof loader>()

    return (
        <Container>
            <div className="flex flex-col p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Ingredientes
                </h1>
                <Form method="post">
                    <Fieldset>
                        <Label htmlFor="ingredients-name">Nome ingrediente</Label>
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
                    {loaderData.length === 0 && (
                        <span>Nenhum ingrediente cadastrado</span>
                    )}
                    <IngredientList ingredients={loaderData} />
                </CardContent>
            </Card>

        </Container>
    )
}


function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
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
                            <Button size="sm">
                                <MoreHorizontal size={16} />
                            </Button>
                            {/* <Button size="sm" type="submit" name="_action" value="ingredient-add-price">Adiçionar Preço</Button> */}
                        </div>
                    </Form>
                    <Separator />
                </li>
            ))}
        </ul>
    )
}