import { Form, Link, useActionData, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { MoreHorizontal, PinOff } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { AlertError } from "~/components/layout/alerts/alerts";
import { json, type ActionArgs } from "@remix-run/node";
import tryit from "~/lib/try-it";
import type { Product } from "~/data-access/models/product-model.server";
import { ProductModel } from "~/data-access/models/product-model.server";
import { badRequest, ok, serverError } from "~/lib/api-response";
import { ProductCompositionModel } from "~/data-access/models/product-composition-model.server";
import errorMessage from "~/lib/error-message";
import { ProductInfoModel } from "~/data-access/models/product-info-model.server";
import { IngredientModel } from "~/data-access/models/ingredient-model.server";
import { IngredientPriceModel } from "~/data-access/models/ingredient-price-model.server";
import { Table, TableRow, TableRows, TableTitles } from "~/components/primitives/table-list";

// all the elemnts that are ingredients or products, part of a composition
interface CompositionElement {
    id: string | undefined
    name: string
    type: string
    unit: string
    unitPrice: number
}

export async function loader() {

    const [errProducts, products] = await tryit(ProductModel.findAll())
    if (errProducts) {
        return serverError({ message: errProducts.message })
    }

    const [errProductsInfo, productsInfo] = await tryit(ProductInfoModel.findAll())
    if (errProductsInfo) {
        return serverError({ message: errProductsInfo.message })
    }

    const [errProductsCompositions, productsCompositions] = await tryit(ProductCompositionModel.findAll())
    if (errProductsCompositions) {
        return serverError({ message: errProductsCompositions.message })
    }

    const [errIngredients, ingredients] = await tryit(IngredientModel.findAll())
    if (errIngredients) {
        return serverError({ message: errIngredients.message })
    }

    // get all ingredients prices that are default
    const [errIngredientsPrices, ingredientsPrices] = await tryit(IngredientPriceModel.findWhere("defaultPrice", "==", true))
    if (errIngredientsPrices) {
        return serverError({ message: errIngredientsPrices.message })
    }

    // all the elemnts that are ingredients and products part of a composition
    const compositionsElements: CompositionElement[] = products
        .filter(p => productsInfo.find(pi => pi.productId === p.id && pi.isAlsoAnIngredient === true))
        .map(p => {
            return {
                id: p.id,
                name: p.name,
                type: "product",
                unit: "un",
                unitPrice: productsCompositions.filter(pc => pc.productId === p.id).reduce((acc, curr) => {
                    return acc + (ingredientsPrices.find(ip => ip.ingredientId === curr.elementId)?.unitPrice || 0)
                }, 0)

            }
        }).concat(ingredients.map(i => {
            return {
                id: i.id,
                name: i.name,
                type: "ingredient",
                unit: ingredientsPrices.find(ip => ip.ingredientId === i.id)?.unit || "un",
                unitPrice: ingredientsPrices.find(ip => ip.ingredientId === i.id)?.unitPrice || 0
            }
        }))

    return json({
        products,
        productsInfo,
        productsCompositions,
        compositionsElements,
        ingredients
    })
}



export default function ProducstIndex() {
    // const responseData = useActionData<typeof action>();
    const loaderData = useLoaderData<typeof loader>()
    const products = loaderData?.products

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





