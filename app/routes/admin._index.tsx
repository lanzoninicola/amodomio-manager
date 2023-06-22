import type { LoaderArgs } from "@remix-run/node";
import { redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { AlertCircle, Edit, Trash } from "lucide-react";
import { useState } from "react";
import Container from "~/components/layout/container/container";
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import type { MenuItem } from "~/domain/menu-item/menu-item.model.server";
import { menuEntity } from "~/domain/menu-item/menu-item.entity.server";
import { badRequest, ok } from "~/utils/http-response.server";
import SortingOrderItems from "~/components/primitives/sorting-order-items/sorting-order-items";
import Tabs from "~/components/primitives/tabs/tabs";
import sort from "~/utils/sort";

export const meta: V2_MetaFunction = () => {
    return [
        {
            name: "robots",
            content: "noindex",
        },
        {
            name: "title",
            content: "Administração do cardápio",
        }
    ];
};

type MenuWithCreateDate = MenuItem & { createdAt: string }

export async function loader({ request }: LoaderArgs) {
    const url = new URL(request.url)
    const tab = url.searchParams.get('tab')

    if (!tab) {
        return redirect('/admin?tab=all')
    }

    const items = await menuEntity.findAll() as MenuWithCreateDate[]
    const categories = await categoryEntity.findAll()

    // order by created at
    const sortedItems = sort(items, "createdAt", "desc")

    return ok({
        items: sortedItems,
        categories
    })
}

export async function action({ request }: LoaderArgs) {

    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "menu-item-create") {
        const menuItem: MenuItem = {}

        const itemCreated = await menuEntity.create(menuItem)

        return redirect(`/admin?_action=menu-item-create&id=${itemCreated.id}`)
    }

    if (_action === "menu-item-edit") {

        const name = values.name as string
        const ingredients = values.ingredients as string
        const ingredientsIta = values.ingredientsIta as string
        // const description = values.description as string
        const price = values.price as string
        const categoryId = values.categoryId as string

        if (!categoryId) {
            badRequest("Categoria é obrigatória")
        }

        const menuItem: MenuItem = {
            id: values.id as string,
            category: {
                id: categoryId
            },
            visible: values.visible === "on" ? true : false

        }

        if (name !== "") {
            menuItem.name = name
        }

        if (ingredients !== "") {
            menuItem.ingredients = ingredients.split(",")
        }

        if (ingredientsIta !== "") {
            menuItem.ingredientsIta = ingredientsIta.split(",")
        }

        if (price !== "") {
            menuItem.price = price
        }

        // if (description !== "") {
        //     menuItem.description = description
        // }

        await menuEntity.update(values.id as string, menuItem)
    }

    if (_action === "menu-item-delete") {
        await menuEntity.delete(values.id as string)
        return redirect(`/admin`)
    }

    if (_action === "item-sortorder-up") {
        await menuEntity.sortUp(values.id as string, values.groupId as string)
    }

    if (_action === "item-sortorder-down") {
        await menuEntity.sortDown(values.id as string, values.groupId as string)
    }


    return null
}

export type MenuItemActionSearchParam = "menu-item-create" | "menu-item-edit" | "menu-item-delete" | "menu-items-sortorder" | null

export default function AdminCardapio() {
    const loaderData = useLoaderData<typeof loader>()
    const items = loaderData.payload.items as MenuItem[]
    const categories = loaderData.payload.categories as Category[]

    const [searchParams, setSearchParams] = useSearchParams()
    const action = searchParams.get("_action") as MenuItemActionSearchParam

    const itemId = searchParams.get("id")
    const itemToEdit = items.find(item => item.id === itemId) as MenuItem


    const currentCategoryTab = searchParams.get("tab")
    const itemsFiltered = items.filter(item => {
        if (currentCategoryTab) {
            if (currentCategoryTab === "all") return true
            return item.category?.id === currentCategoryTab
        }
        return true
    })

    // const itemsFilteredSorted = itemsFiltered.sort((a, b) => {
    //     if ((a.sortOrder || 0) > (b.sortOrder || 0)) {
    //         return 1
    //     }
    //     if ((a.sortOrder || 0) < (b.sortOrder || 0)) {
    //         return -1
    //     }
    //     return 0
    // })

    const itemsFilteredSorted = sort(itemsFiltered, "sortOrder", "asc")



    return (
        <Container>
            <div className="fixed top-[35px] left-0  w-full p-4 bg-muted z-10" >
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold text-xl">Cardapio</h1>
                    <Form method="post">
                        <SubmitButton actionName="menu-item-create" className="w-max" idleText="Criar item" loadingText="Criando..."
                            disabled={action === "menu-item-create" || action === "menu-item-edit"}
                        />
                    </Form>
                </div>
                {currentCategoryTab !== "all" && (
                    <div className="flex gap-2">
                        <Link to={`?tab=${currentCategoryTab}&_action=menu-items-sortorder`} className="mr-4">
                            <span className="text-sm underline">Ordenamento</span>
                        </Link>
                        {action === "menu-items-sortorder" && (
                            <Link to="/admin" className="mr-4">
                                <span className="text-sm underline">Fechar Ordenamento</span>
                            </Link>
                        )}
                    </div>
                )}
                <MenuItemForm item={itemToEdit} action={action} />
            </div>
            <div className="mt-40 min-w-[350px]">
                <CategoriesTabs categories={categories} />
                <MenuItemList items={itemsFilteredSorted} action={action} />
            </div>

        </Container>
    )
}


interface MenuItemFormProps {
    item: MenuItem
    action: Partial<MenuItemActionSearchParam>
}

function MenuItemForm({ item, action }: MenuItemFormProps) {
    const loaderData = useLoaderData<typeof loader>()
    const categories = loaderData.payload.categories as Category[]

    const ingredientsString = item?.ingredients && item.ingredients.join(", ")
    const ingredientsItaString = item?.ingredientsIta && item.ingredientsIta.join(", ")


    const submitButtonIdleText = action === "menu-item-edit" ? "Atualizar" : "Criar"
    const submitButtonLoadingText = action === "menu-item-edit" ? "Atualizando..." : "Criando..."

    if (action !== "menu-item-edit" && action !== "menu-item-create") return null

    return (

        <div className="p-4 rounded-md border-2 border-muted">
            <Form method="post" className="">
                <div className="flex justify-between">
                    <div className="flex gap-2 mb-4">
                        <span className="text-xs font-semibold">Pizza ID:</span>
                        <span className="text-xs">{item.id}</span>
                    </div>
                    <Link to="/admin" className="text-xs underline">Voltar</Link>
                </div>
                <Fieldset>
                    <InputItem type="hidden" name="id" defaultValue={item.id} />
                    <InputItem type="text" name="name" defaultValue={item.name} placeholder="Nome pizza" />
                </Fieldset>
                <Fieldset>
                    <Fieldset>
                        <div className="md:max-w-[150px]">
                            <Select name="categoryId" defaultValue={item?.category?.id ?? undefined}>
                                <SelectTrigger >
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent id="categoryId"   >
                                    <SelectGroup >
                                        {categories && categories.map(category => {
                                            return (
                                                <SelectItem key={category.id} value={category.id ?? ""} className="text-lg">{category.name}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </Fieldset>
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
                    <SubmitButton actionName={action} idleText={submitButtonIdleText} loadingText={submitButtonLoadingText} />

                </div>
            </Form>
        </div>

    )
}

function InputItem({ ...props }) {
    return (
        <Input className="text-lg p-2 no-border border-0 placeholder:text-gray-400" {...props} autoComplete="nope" />
    )
}


interface MenuItemListProps {
    items: MenuItem[]
    action: Partial<MenuItemActionSearchParam>
}

function MenuItemList({ items, action }: MenuItemListProps) {
    if (action === "menu-item-edit" || action === "menu-item-create") return null

    return (
        <ul>
            {
                (!items || items.length === 0) ?
                    <NoRecordsFound text="Nenhum itens no menu" />
                    :
                    items.map(item => {
                        return (
                            <li key={item.id} className="mb-4">
                                <MenuItemCard item={item} />
                            </li>
                        )
                    })
            }
        </ul>
    )
}


function CategoriesTabs({ categories }: { categories: Category[] }) {
    const categoryTabs = categories.map(category => (
        {
            id: category.id ?? "",
            name: category.name,
            linkTo: `/admin?tab=${category.name}&categoryId=${category.id}`,
            default: category.name === "Classica"
        }
    ))


    const tabs = [
        {
            id: "all",
            name: "Todas",
            linkTo: "/admin",
            default: true
        },
        ...categoryTabs
    ]

    return <Tabs tabs={tabs} />
}



interface MenuItemCardProps {
    item: MenuItem
}

function MenuItemCard({ item }: MenuItemCardProps) {
    const loaderData = useLoaderData<typeof loader>()
    const categories = loaderData.payload.categories as Category[]


    const [showDetails, setShowDetails] = useState(false)

    const ingredientsString = item?.ingredients ? item.ingredients.join(", ") : "Nenhum ingrediente cadastrado"
    const ingredientsItaString = item?.ingredientsIta ? item.ingredientsIta.join(", ") : "Nenhum ingrediente cadastrado"
    const pizzaTitle = item?.name || "Nenhum nome cadastrado"

    const pizzaCategory = categories.find(category => category.id === item.category?.id)

    const missingInfo = !item?.name || !item?.price || !item?.ingredients || !item?.ingredientsIta


    const [searchParams, setSearchParams] = useSearchParams()
    const action = searchParams.get("_action")

    return (

        <div className={`border-2 border-muted rounded-lg p-4 flex flex-col gap-2`}>
            <SortingOrderItems enabled={action === "menu-items-sortorder"} itemId={item.id} groupId={pizzaCategory?.id}>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold tracking-tight">{pizzaTitle}</h2>
                        <Link to={`?_action=menu-item-edit&id=${item.id}`} >
                            <Edit size={24} className="cursor-pointer" />
                        </Link>
                    </div>
                    <h3 className="flex gap-2">
                        <span className="text-sm font-semibold text-muted-foreground">Cátegoria:</span>
                        <span className="text-sm">{pizzaCategory?.name}</span>
                    </h3>
                    <div className="flex justify-between w-full">
                        <span className="font-semibold text-sm">Pública no cardápio</span>
                        <Switch id="visible" name="visible" defaultChecked={item.visible} disabled />
                    </div>
                </div>
                <div>
                    <span className="text-xs underline" onClick={() => setShowDetails(!showDetails)}>Detalhes</span>
                    {
                        showDetails && (
                            <div className="mt-4">
                                {/* <p className="text-gray-500">{item.description}</p> */}
                                <div className="flex flex-col mb-2">
                                    <span className="font-semibold text-sm">Preço:</span>
                                    <div className="flex gap-2">
                                        <span className="text-gray-500 text-sm">R$</span>
                                        <p className="text-gray-500 text-sm">{item.price}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">Ingredientes</span>
                                        <p className="text-gray-500 text-sm">{ingredientsString}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">Ingredientes em Italiano</span>
                                        <p className="text-gray-500 text-sm">{ingredientsItaString}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                {missingInfo && item.visible === true && (
                    <div className="border-2 border-red-500 bg-red-200 rounded-md p-4 mt-4">
                        <div className="flex gap-2">
                            <AlertCircle color="red" />
                            <div className="flex flex-col gap-1">
                                {(item?.name === undefined || item.name === "") && <span className="text-xs font-semibold text-red-500">Nome não cadastrado</span>}
                                {(item?.price === undefined || item.price === "") && <span className="text-xs font-semibold text-red-500">Preço não cadastrado</span>}
                                {(item?.ingredients === undefined || item.ingredients.length === 0) && <span className="text-xs font-semibold text-red-500">Ingredientes não cadastrados</span>}
                                {(item?.ingredientsIta === undefined || item.ingredientsIta.length === 0) && <span className="text-xs font-semibold text-red-500">Ingredientes em Italiano não cadastrados</span>}
                            </div>

                        </div>
                    </div>
                )}
            </SortingOrderItems>
        </div>

    )
}