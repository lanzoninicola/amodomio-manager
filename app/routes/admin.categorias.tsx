import type { LoaderArgs } from "@remix-run/node";
import { redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { Edit, Trash } from "lucide-react";
import Container from "~/components/layout/container/container";
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found";
import SortingOrderItems from "~/components/primitives/sorting-order-items/sorting-order-items";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import { ok } from "~/utils/http-response.server";

export const meta: V2_MetaFunction = () => {
    return [
        {
            name: "robots",
            content: "noindex",
        },
        {
            name: "title",
            content: "Categorias | A Modo Mio",
        }
    ];
};


export async function loader() {
    const categories = await categoryEntity.findAll()
    return ok({ categories })
}

export async function action({ request }: LoaderArgs) {

    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "category-create") {
        const category: Category = {
            name: values.name as string || "",
            type: "menu",
            visible: values.visible === "on" ? true : false,
            sortOrder: values?.sortOrder ? parseInt(values.sortOrder as string) : 0,
            default: values.default === "on" ? true : false
        }

        const itemCreated = await categoryEntity.create(category)

        return redirect(`/admin/categorias?_action=category-create&id=${itemCreated.id}`)
    }

    if (_action === "category-edit") {

        const category: Category = {
            id: values.id as string,
            name: values.name as string,
            type: "menu",
            visible: values.visible === "on" ? true : false,
            default: values.default === "on" ? true : false
        }

        await categoryEntity.update(values.id as string, category)
    }

    if (_action === "category-delete") {
        await categoryEntity.delete(values.id as string)
        return redirect(`/admin/categorias`)
    }

    if (_action === "item-sortorder-up") {
        await categoryEntity.sortUp(values.id as string)
    }

    if (_action === "item-sortorder-down") {
        await categoryEntity.sortDown(values.id as string)
    }

    return null
}

export default function AdminCategories() {
    const loaderData = useLoaderData<typeof loader>()
    const categories = loaderData.payload.categories as Category[]

    const categoriesSorted = categories.sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0))

    const [searchParams, setSearchParams] = useSearchParams()
    const action = searchParams.get("_action")
    const itemId = searchParams.get("id")

    const itemToEdit = categories.find(category => category.id === itemId) as Category



    return (
        <Container>
            <div className="fixed top-[35px] left-0  w-full p-4 bg-muted z-10" >
                <div className="flex categories-center justify-between mb-4 items-center">
                    <h1 className="font-bold text-xl">Categorias</h1>
                    <Form method="post">
                        <SubmitButton actionName="category-create" className="w-max" idleText="Criar categoria" loadingText="Criando..."
                            disabled={action === "category-create" || action === "category-edit"}
                        />
                    </Form>
                </div>
                <div className="flex gap-2">
                    <Link to="?_action=categories-sortorder" className="mr-4">
                        <span className="text-sm underline">Ordenamento</span>
                    </Link>
                    {action === "categories-sortorder" && (
                        <Link to="/admin/categorias" className="mr-4">
                            <span className="text-sm underline">Fechar Ordenamento</span>
                        </Link>
                    )}
                </div>
                {(action === "category-edit" || action === "category-create") && <CategoryForm category={itemToEdit} action={action} />}
            </div>

            <div className="min-w-[350px]">
                {
                    (action === "category-edit" || action === "category-create") ? null :
                        <ul className="mt-40">
                            {
                                (!categories || categories.length === 0) ?
                                    <NoRecordsFound text="Nenhum itens no menu" />
                                    :
                                    categoriesSorted.map(category => {
                                        return (
                                            <li key={category.id} className="mb-4">
                                                <CategoryList category={category} />
                                            </li>
                                        )
                                    })
                            }
                        </ul>
                }
            </div>
        </Container>
    )
}


interface CategoryFormProps {
    category: Category
    action: "category-create" | "category-edit"
}

function CategoryForm({ category, action }: CategoryFormProps) {

    const submitButtonIdleText = action === "category-edit" ? "Atualizar" : "Criar"
    const submitButtonLoadingText = action === "category-edit" ? "Atualizando..." : "Criando..."

    return (

        <div className="p-4 rounded-md border-2 border-muted">
            <Form method="post" className="">
                <div className="flex justify-between">
                    <div className="flex gap-2 mb-4">
                        <span className="text-xs font-semibold">Category ID:</span>
                        <span className="text-xs">{category.id}</span>
                    </div>
                    <Link to="/admin/categorias" className="text-xs underline">Voltar</Link>
                </div>
                <Fieldset>
                    <InputItem type="hidden" name="id" defaultValue={category.id} />
                    <InputItem type="text" name="name" defaultValue={category.name} placeholder="Nome categoria" />
                </Fieldset>
                <Fieldset>
                    <Label htmlFor="visible" className="flex gap-2 items-center justify-end">
                        Visível
                        <Switch id="visible" name="visible" defaultChecked={category.visible} />
                    </Label>
                </Fieldset>
                <Fieldset>
                    <Label htmlFor="default" className="flex gap-2 items-center justify-end">
                        Padrão
                        <Switch id="default" name="default" defaultChecked={category.default} />
                    </Label>
                </Fieldset>
                <div className="flex gap-4">
                    <Button type="submit" variant="destructive" name="_action" value="category-delete" className="flex-1">
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

interface CategoryListProps {
    category: Category
}

function CategoryList({ category }: CategoryListProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    const action = searchParams.get("_action")

    return (
        <div className={`border-2 border-muted rounded-lg p-4 flex flex-col gap-2 w-full`}>

            <SortingOrderItems enabled={action === "categories-sortorder"} itemId={category.id}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-lg font-bold tracking-tight">{category.name}</h2>
                    <Link to={`?_action=category-edit&id=${category.id}`} >
                        <Edit size={24} className="cursor-pointer" />
                    </Link>
                </div>
                <div className="flex justify-between w-full">
                    <span className="font-semibold text-sm">Pública no cardápio</span>
                    <Switch id="visible" name="visible" defaultChecked={category.visible} disabled />
                </div>
            </SortingOrderItems>
        </div>
    )
}

