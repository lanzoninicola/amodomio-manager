import type { ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, Link, useSearchParams } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { DeleteItemButton, EditItemButton, Table, TableRow, TableRows, TableTitles } from "~/components/primitives/table-list";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";

export async function loader() {
    const categories = await categoryEntity.findAll()

    return ok({ categories })
}

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const categoryEntity = new CategoryEntity()


    if (_action === "category-add") {
        const [err, data] = await tryit(categoryEntity.create({ name: values.name as string }))

        if (err) {
            return badRequest({ action: "category-add", message: errorMessage(err) })
        }

        return ok({ data })

    }

    if (_action === "category-edit") {
        const [err, data] = await tryit(categoryEntity.update(values.id as string, { name: values.name as string }))

        if (err) {
            return badRequest({ action: "category-edit", message: errorMessage(err) })
        }

        return ok({ data })

    }

    if (_action === "category-delete") {
        const [err, data] = await tryit(categoryEntity.delete(values.id as string))

        if (err) {
            return badRequest({ action: "category-delete", message: errorMessage(err) })
        }

        return ok()
    }

    return null
}



export default function CategoryIndex() {

    const [searchParams, setSearchParams] = useSearchParams()
    const categoryId = searchParams.get("id")

    const formSubmissionAction = categoryId ? "category-edit" : "category-add"

    const category = useLoaderData<typeof loader>().payload.categories.find((c: Category) => c.id === categoryId)

    return (
        <Container clazzName={"mb-8"}>
            <div className="flex flex-col mb-8">
                <h1 className="text-2xl font-bold mb-4">
                    Categories
                </h1>
                <Form method="post">
                    <Input type="hidden" name="id" defaultValue={categoryId || undefined} />
                    <Fieldset>
                        <Label htmlFor="category-name">Nome</Label>
                        <Input type="text" id="category-name" placeholder="Nome" name="name" defaultValue={categoryId && category?.name} autoComplete="off" />
                    </Fieldset>
                    <div className="flex gap-2">
                        <SubmitButton actionName={formSubmissionAction} />
                        {categoryId && (
                            <Link to="/admin/categories">
                                <Button type="button" variant={"outline"}>Nova categoria</Button>
                            </Link>
                        )}
                    </div>
                </Form>

            </div>

            <CategoryList />

        </Container>
    )
}

export function CategoryList() {
    const loaderData = useLoaderData<typeof loader>()
    const categories = loaderData?.payload.categories as Category[]

    return (
        <Container>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Lista das categorias</h3>
            </div>
            <Table>
                <TableTitles
                    clazzName="grid-cols-4"
                    titles={[
                        "Ações",
                        "Nome",
                        "Criado em",
                        "Atualizado em",
                    ]}
                />
                <TableRows>
                    {categories.map((c) => {
                        return <CategoryTableRow key={c.id} category={c} clazzName="grid-cols-4" />;
                    })}
                </TableRows>
            </Table>
        </Container>
    )
}

interface CategoryTableRowProps {
    category: Category;
    clazzName?: string;
}



function CategoryTableRow({ category, clazzName }: CategoryTableRowProps) {
    const navigation = useNavigation()

    return (

        <Form method="post" >
            <TableRow
                row={category}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName}`}
            >
                <div className="flex gap-2 md:gap-2 items-center">
                    <EditItemButton to={`/admin/categories?id=${category.id}`} />
                    <DeleteItemButton actionName="category-delete" />
                </div>
                <div>
                    <Input type="hidden" name="id" value={category.id} />
                    <Input name="id" defaultValue={category.name} className="border-none w-full" />
                </div>

            </TableRow>
        </Form>
    )
}
