import type { ActionArgs } from "@remix-run/node"
import { useLoaderData, useNavigation, Form } from "@remix-run/react"
import Container from "~/components/layout/container/container"
import { TableTitles, TableRows, TableRow, Table, EditItemButton, DeleteItemButton } from "~/components/primitives/table-list"
import { Input } from "~/components/ui/input"
import { ProductEntity } from "~/domain/product/product.entity"
import type { ProductInfo } from "~/domain/product/product.model.server"
import { type Product } from "~/domain/product/product.model.server"
import errorMessage from "~/utils/error-message"
import { badRequest, ok, serverError } from "~/utils/http-response.server"
import tryit from "~/utils/try-it"


export async function loader() {
    const productEntity = new ProductEntity()
    const [errProducts, products] = await tryit(productEntity.findAll())
    if (errProducts) {
        return serverError({ message: errProducts.message })
    }

    return ok({ products })
}


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const productEntity = new ProductEntity()

    if (_action === "product-delete") {

        const [err, data] = await tryit(productEntity.delete(values.id as string))

        if (err) {
            return badRequest({ action: "product-delete", message: errorMessage(err) })
        }

        return ok({ message: "Produto deletado com sucesso" })
    }

    return null
}


export default function ProducstIndex() {
    const loaderData = useLoaderData<typeof loader>()
    const products = loaderData?.payload.products as Product[]

    return (
        <Container>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Lista de produtos</h3>
            </div>
            <Table>
                <TableTitles
                    clazzName="grid-cols-5"
                    titles={[
                        "Ações",
                        "Nome",
                        "Tipo",
                        "Criado em",
                        "Atualizado em",
                    ]}
                />
                <TableRows>
                    {products.map((p) => {
                        return <ProductTableRow key={p.id} product={p} clazzName="grid-cols-5" />;
                    })}
                </TableRows>
            </Table>
        </Container>
    )
}


interface ProductTableRowProps {
    product: Product;
    clazzName?: string;
}

function ProductTableRow({ product, clazzName }: ProductTableRowProps) {
    const navigation = useNavigation()

    return (

        <Form method="post" >
            <TableRow
                row={product}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName}`}
            >
                <div className="flex gap-2 md:gap-2">
                    <EditItemButton to={`/admin/products/${product.id}/info`} />
                    <DeleteItemButton actionName="product-delete" />
                </div>
                <div>
                    <Input type="hidden" name="id" value={product.id} />
                    <Input name="name" defaultValue={product.name} className="border-none w-full" readOnly />
                </div>
                <ProductTypeBadge type={product?.info?.type} />
            </TableRow>
        </Form>
    )
}

interface ProductTypeBadgeProps {
    type?: ProductInfo["type"] | null
}

function ProductTypeBadge({ type }: ProductTypeBadgeProps) {

    const backgroundColor = {
        manufactured: "bg-green-100",
        group: "bg-blue-100",
        kit: "bg-blue-100",
        "raw_material": "bg-gray-100",
        "semi_manufactured": "bg-gray-100",
        simple: "bg-green-100",
    }

    const baseStyle = "px-4 py-1 rounded-full text-xs text-gray-800 max-w-max"

    if (!type) return <span className={`${baseStyle} bg-red-200`}>{ProductEntity.getProductTypeValues(type)}</span>

    return (
        <span className={`${baseStyle} ${backgroundColor[type]} `}>
            {ProductEntity.getProductTypeValues(type)}
        </span>
    )
}


