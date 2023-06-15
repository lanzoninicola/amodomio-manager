import { useLoaderData, useNavigation, Form } from "@remix-run/react"
import Container from "~/components/layout/container/container"
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found"
import { TableTitles, TableRows, TableRow, Table, EditItemButton } from "~/components/primitives/table-list"
import { Input } from "~/components/ui/input"
import { sizeEntity } from "~/domain/size/size.entity.server"
import type { Size } from "~/domain/size/size.model.server"
import { ok, serverError } from "~/utils/http-response.server"
import tryit from "~/utils/try-it"


export async function loader() {

    const [err, sizes] = await tryit(sizeEntity.findAll())
    if (err) {
        return serverError({ message: err.message })
    }

    return ok({ sizes })
}



export default function SizeIndex() {
    const loaderData = useLoaderData<typeof loader>()
    const sizes = loaderData?.payload.sizes as Size[]

    if (sizes.length === 0) {
        return <NoRecordsFound text="Nenhum tamanho cadastrado" clazzName="mt-8" additionalInfo="Clique no botão 'Novo Tamanho' para iniçiar o cadastro" />
    }

    return (
        <Container>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Lista de tamanhos</h3>
            </div>
            <Table>
                <TableTitles
                    clazzName="grid-cols-7"
                    titles={[
                        "Ações",
                        "Nome",
                        "Numero de fatias",
                        "Numero max de sabores",
                        "Fator x tamanho",
                        "Fator x sabor",
                        "Data",
                    ]}
                />
                <TableRows>
                    {sizes.map((s) => {
                        return <SizeTableRow key={s.id} size={s} clazzName="grid-cols-7" />;
                    })}
                </TableRows>
            </Table>
        </Container>
    )
}


interface SizeTableRowProps {
    size: Size;
    clazzName?: string;
}

function SizeTableRow({ size, clazzName }: SizeTableRowProps) {
    const navigation = useNavigation()

    return (

        <Form method="post" >
            <TableRow
                row={size}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName}`}
                dateColumnsCondensed={true}
            >
                <EditItemButton to={`/admin/sizes/${size.id}/info`} />
                <Input type="hidden" name="id" value={size.id} />
                <Input name="name" defaultValue={size.name} className="border-none w-full" />
                <Input type="text" readOnly defaultValue={size.slices} className="border-none max-w-[70px]" />
                <Input type="text" readOnly defaultValue={size.maxToppingsAmount} className="border-none max-w-[70px]" />
                <Input type="text" readOnly defaultValue={size.factorSize} className="border-none max-w-[70px]" />
                <Input type="text" readOnly defaultValue={size.factorToppingsAmount} className="border-none max-w-[70px]" />

            </TableRow>
        </Form>
    )
}





