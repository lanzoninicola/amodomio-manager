import type { ActionArgs } from "@remix-run/node"
import { useNavigation, Form, useLoaderData } from "@remix-run/react"
import Container from "~/components/layout/container/container"
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found"
import { TableTitles, TableRows, TableRow, Table, EditItemButton, DeleteItemButton } from "~/components/primitives/table-list"
import { Input } from "~/components/ui/input"
import { catalogEntity } from "~/domain/catalog/catalog.entity.server"
import type { Catalog } from "~/domain/catalog/catalog.model.server"
import errorMessage from "~/utils/error-message"
import { serverError, ok, badRequest } from "~/utils/http-response.server"
import tryit from "~/utils/try-it"


export async function loader() {
    const [err, catalogs] = await tryit(catalogEntity.findAll())
    if (err) {
        return serverError({ message: err.message })
    }

    const catalogTypes = catalogEntity.getCatalogTypes()

    return ok({ catalogs, catalogTypes })
}

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);



    if (_action === "catalog-delete") {

        const [err, data] = await tryit(catalogEntity.delete(values.id as string))

        if (err) {
            return badRequest({ action: "product-delete", message: errorMessage(err) })
        }

        return ok({ message: "Produto deletado com sucesso" })
    }

    return null
}



export default function CatalogsIndex() {
    const loaderData = useLoaderData<typeof loader>()
    const catalogs = loaderData?.payload.catalogs as Catalog[]



    return (
        <Container>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Lista de catálogos</h3>
            </div>
            {catalogs.length === 0 ? <NoRecordsFound text="Nenhum catalogo cadastrado" clazzName="mt-8" additionalInfo="Clique no botão 'Novo Catalogo' para iniçiar o cadastro" />
                : <Table>
                    <TableTitles
                        clazzName="grid-cols-4"
                        titles={[
                            "Ações",
                            "Nome",
                            "Data de criação",
                            "Data de atualização"
                        ]}
                    />
                    <TableRows>
                        {catalogs.map((s) => {
                            return <CatalogTableRow key={s.id} catalog={s} clazzName="grid-cols-4" />;
                        })}
                    </TableRows>
                </Table>}
        </Container>
    )
}


interface CatalogTableRowProps {
    catalog: Catalog;
    clazzName?: string;
}

function CatalogTableRow({ catalog, clazzName }: CatalogTableRowProps) {
    const navigation = useNavigation()

    return (

        <Form method="post" >
            <TableRow
                row={catalog}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName}`}
            >
                <div>
                    <EditItemButton to={`/admin/catalogs/${catalog.id}/items`} />
                    <DeleteItemButton actionName="catalog-delete" />
                </div>
                <Input type="hidden" name="id" value={catalog.id} />
                <Input name="name" defaultValue={catalog.name} className="border-none w-full" />
            </TableRow>
        </Form>
    )
}





