import type { LoaderArgs } from "@remix-run/node";
import { type V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Trash } from "lucide-react";
import Container from "~/components/layout/container/container";
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import type { MenuItem } from "~/domain/menu-item/menu-item";
import { menuEntity } from "~/domain/menu-item/menu-item.entity";
import { ok } from "~/utils/http-response.server";

export const meta: V2_MetaFunction = () => {
    return [
        {
            name: "robots",
            content: "noindex",
        },
    ];
};

type MenuWithCreateDate = MenuItem & { createdAt: string }

export async function loader() {

    const items = await menuEntity.findAll() as MenuWithCreateDate[]

    // order by created at
    const sortedItems = items.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
            return -1
        }
        if (a.createdAt < b.createdAt) {
            return 1
        }
        return 0
    })


    return ok({
        items: sortedItems
    })
}

export async function action({ request }: LoaderArgs) {

    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "menu-item-create") {
        await menuEntity.create(values)
    }

    if (_action === "menu-item-update") {

        const ingredients = values.ingredients as string
        const ingredientsIta = values.ingredientsIta as string

        const menuItem = {
            id: values.id,
            name: values.name,
            description: values.description ?? "",
            price: values.price,
            ingredients: ingredients.split(","),
            ingredientsIta: ingredientsIta.split(","),
            visible: values.visible === "on" ? true : false
        }

        await menuEntity.update(values.id as string, menuItem)
    }

    if (_action === "menu-item-delete") {
        await menuEntity.delete(values.id as string)
    }

    return null
}

export default function AdminIndex() {
    const loaderData = useLoaderData<typeof loader>()
    const items = loaderData.payload.items as MenuItem[]


    return (
        <Container>
            <div className="fixed top-0 left-0 h-16 w-full p-4 bg-muted z-10" >
                <div className="flex items-center justify-between mb-8 ">
                    <h1 className="font-bold text-xl">Cardapio</h1>
                    <Form method="post">
                        <SubmitButton actionName="menu-item-create" className="w-max" idleText="Criar item" loadingText="Criando..." />
                    </Form>
                </div>
            </div>

            <div className="mt-16">
                <ul>
                    {
                        (!items || items.length === 0) ?
                            <NoRecordsFound text="Nenhum itens no menu" />
                            :
                            items.map(item => {
                                return (
                                    <li key={item.id} className="mb-4">
                                        <MenuItemComp item={item} />
                                    </li>
                                )
                            })
                    }
                </ul>
            </div>

        </Container>
    )
}


interface MenuItemCompProps {
    item: MenuItem
}

function MenuItemComp({ item }: MenuItemCompProps) {

    const ingredientsString = item?.ingredients && item.ingredients.join(", ")
    const ingredientsItaString = item?.ingredientsIta && item.ingredientsIta.join(", ")

    console.log(item)

    const submitButtonIdleText = item?.name ? "Atualizar" : "Criar"
    const submitButtonLoadingText = !item.name ? "Atualizando..." : "Criando..."

    return (

        <div className="p-4 rounded-md border-2 border-muted">
            <Form method="post" className="">
                <Fieldset>
                    <InputItem type="hidden" name="id" defaultValue={item.id} />
                    <InputItem type="text" name="name" defaultValue={item.name} placeholder="Nome pizza" />
                </Fieldset>
                {/* <Fieldset>
                    <InputItem type="text" name="description" defaultValue={item.description} placeholder="Descrição" />
                </Fieldset> */}
                <Fieldset>
                    <InputItem type="text" name="price" defaultValue={item.price} placeholder="Preço" />
                </Fieldset>
                <Fieldset>
                    <InputItem type="text" name="ingredients" defaultValue={ingredientsString} placeholder="Ingredientes" />
                </Fieldset>
                <Fieldset>
                    <InputItem type="text" name="ingredientsIta" defaultValue={ingredientsItaString} placeholder="Ingredientes em Italiano" />
                </Fieldset>

                <Fieldset>
                    <Label htmlFor="visible" className="flex gap-2 items-center justify-end">
                        Visível
                        <Switch id="visible" name="visible" defaultChecked={item.visible} />
                    </Label>
                </Fieldset>
                <div className="flex gap-4">
                    <Button type="submit" variant="destructive" name="_action" value="menu-item-delete" className="flex-1">
                        <Trash size={16} className="mr-2" />
                        Excluir
                    </Button>
                    <SubmitButton actionName="menu-item-update" idleText={submitButtonIdleText} loadingText={submitButtonLoadingText} />

                </div>
            </Form>
        </div>

    )
}

function InputItem({ ...props }) {
    return (
        <Input className="text-lg p-2 no-border border-0 placeholder:font-semibold placeholder:text-gray-400" {...props} autoComplete="nope" />
    )
}