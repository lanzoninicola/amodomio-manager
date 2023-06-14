import { useLoaderData, useNavigation, Form, Link } from "@remix-run/react"
import { MoreHorizontal } from "lucide-react"
import Container from "~/components/layout/container/container"
import { TableTitles, TableRows, TableRow, Table } from "~/components/primitives/table-list"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ProductEntity } from "~/domain/product/product.entity"
import { type Product } from "~/domain/product/product.model.server"
import { ok, serverError } from "~/utils/http-response.server"
import tryit from "~/utils/try-it"


export async function loader() {
    const productEntity = new ProductEntity()
    const [errProducts, products] = await tryit(productEntity.findAll())
    if (errProducts) {
        return serverError({ message: errProducts.message })
    }

    return ok({ products })
}



export default function ProducstIndex() {
    const loaderData = useLoaderData<typeof loader>()
    const products = loaderData?.payload.products

    return (
        <Container>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Lista de produtos</h3>
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
                    {products.map((p) => {
                        return <ProductTableRow key={p.id} product={p} clazzName="grid-cols-4" />;
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
                <div className="flex gap-2 md:gap-4 mb-2">
                    <Link to={`/admin/products/${product.id}/info`}>
                        <Button type="button" variant={"outline"} className="border-black">
                            <MoreHorizontal size={16} />
                        </Button>
                    </Link>
                    {/* <Button variant="outline" className="border-red-500" type="submit" name="_action" value="product-disable">
                        <PinOff size={16} color="red" />
                    </Button> */}

                </div>
                <div>
                    <Input type="hidden" name="id" value={product.id} />
                    <Input name="id" defaultValue={product.name} className="border-none w-full" />
                </div>

            </TableRow>
        </Form>
    )
}





