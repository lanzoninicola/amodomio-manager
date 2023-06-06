import { useLoaderData, useNavigation, Form, Link } from "@remix-run/react"
import { MoreHorizontal, PinOff } from "lucide-react"
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

    // const [errProductsInfo, productsInfo] = await tryit(ProductInfoModel.findAll())
    // if (errProductsInfo) {
    //     return serverError({ message: errProductsInfo.message })
    // }

    // const [errProductsCompositions, productsCompositions] = await tryit(ProductCompositionModel.findAll())
    // if (errProductsCompositions) {
    //     return serverError({ message: errProductsCompositions.message })
    // }

    // const [errIngredients, ingredients] = await tryit(IngredientModel.findAll())
    // if (errIngredients) {
    //     return serverError({ message: errIngredients.message })
    // }

    // // get all ingredients prices that are default
    // const [errIngredientsPrices, ingredientsPrices] = await tryit(IngredientPriceModel.findWhere("defaultPrice", "==", true))
    // if (errIngredientsPrices) {
    //     return serverError({ message: errIngredientsPrices.message })
    // }

    // // all the elemnts that are ingredients and products part of a composition
    // const compositionsElements: CompositionElement[] = products
    //     .filter(p => productsInfo.find(pi => pi.productId === p.id && pi.isAlsoAnIngredient === true))
    //     .map(p => {
    //         return {
    //             id: p.id,
    //             name: p.name,
    //             type: "product",
    //             unit: "un",
    //             unitPrice: productsCompositions.filter(pc => pc.productId === p.id).reduce((acc, curr) => {
    //                 return acc + (ingredientsPrices.find(ip => ip.ingredientId === curr.elementId)?.unitPrice || 0)
    //             }, 0)

    //         }
    //     }).concat(ingredients.map(i => {
    //         return {
    //             id: i.id,
    //             name: i.name,
    //             type: "ingredient",
    //             unit: ingredientsPrices.find(ip => ip.ingredientId === i.id)?.unit || "un",
    //             unitPrice: ingredientsPrices.find(ip => ip.ingredientId === i.id)?.unitPrice || 0
    //         }
    //     }))

    // return ok({
    //     products,
    //     productsInfo,
    //     productsCompositions,
    //     compositionsElements,
    //     ingredients
    // })

    return ok({ products })
}



export default function ProducstIndex() {
    // const responseData = useActionData<typeof action>();
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

            {/* {responseData && responseData?.status >= 400 && (
                <AlertError title={responseData?.action} message={responseData?.message} />)} */}
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
                        <Button type="button" >
                            <MoreHorizontal size={16} />
                        </Button>
                    </Link>
                    <Button variant="destructive" type="submit" name="_action" value="product-disable">
                        <PinOff size={16} />
                    </Button>

                </div>
                <div>
                    <Input type="hidden" name="id" value={product.id} />
                    <Input name="id" defaultValue={product.name} className="border-none w-full" />
                </div>

            </TableRow>
        </Form>
    )
}





