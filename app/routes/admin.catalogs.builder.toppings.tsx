import { type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useOutletContext, useSearchParams } from "@remix-run/react";
import { Check } from "lucide-react";
import { Table, TableRow, TableRows, TableTitles } from "~/components/primitives/table-list";
import Tooltip from "~/components/primitives/tooltip/tooltip";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { catalogEntity } from "~/domain/catalog/catalog.entity.server";
import type { PizzasCatalogItem, Topping } from "~/domain/catalog/catalog.model.server";
import type { Category } from "~/domain/category/category.model.server";
import type { Product } from "~/domain/product/product.model.server";
import type { Size } from "~/domain/size/size.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import toNumber from "~/utils/to-number";
import tryit from "~/utils/try-it";
import type { loader } from "./_index";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);


    if (_action === "catalog-create-add-pizza") {
        // This action tell us that we are going to add a Pizza into the catalog

        const catalogId = values.parentId as string
        const topping = jsonParse(values.topping as string) as Topping

        const pizzaCatalogItem: PizzasCatalogItem = {
            parentId: catalogId,
            product: jsonParse(values.product as string) as Product,
            category: jsonParse(values.category as string) ?? {} as Category,
            size: jsonParse(values.size as string) as Size,
            topping: topping,
            unitPrice: toNumber(values.unitPrice as string),
            unitPromotionPrice: toNumber(values.unitPromotionPrice as string),
        }

        const [err, data] = await tryit(catalogEntity.addProductToCatalog(catalogId, pizzaCatalogItem))

        if (err) {
            return badRequest({ action: "catalog-create-add-pizza", message: errorMessage(err) })
        }

        return ok({ topping: topping })
    }

    return null
}


export default function ToopingsTab() {
    const context = useOutletContext<CatalogBuilderOutletContext>()
    const toppings = context.toppings as Topping[] || []

    return (

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Seleçionar Sabores</CardTitle>
            </CardHeader>
            <CardContent >
                <Table>
                    <TableTitles
                        clazzName="grid-cols-5"
                        titles={[
                            "Seleçionar",
                            "Sabor",
                            "Categoria Sabor",
                            "Preço",
                            "Preço Promocional",
                        ]}
                        center={true}
                    />
                    <TableRows>
                        {
                            toppings.map((topping) => <ToppingTableRows key={topping.id} topping={topping} clazzName="grid-cols-5" />)
                        }
                    </TableRows>
                </Table>
            </CardContent>

        </Card>


    )
}



interface ToppingTableRowsProps {
    topping: Topping;
    clazzName?: string;
}

function ToppingTableRows({ topping, clazzName }: ToppingTableRowsProps) {
    const loaderData = useLoaderData<typeof loader>()
    const products = loaderData.payload.products as Product[] || []
    const categories = loaderData.payload.categories as Category[] || []
    const sizes = loaderData.payload.sizes as Size[] || []

    const [searchParams, setSearchParams] = useSearchParams()
    const catalogId = searchParams.get("catalogId")
    const productId = searchParams.get("productId")
    const sizeId = searchParams.get("sizeId")


    const productSelected = products.find((p) => p.id === productId)
    const sizeSelected = sizes.find((s) => s.id === sizeId)

    const navigation = useNavigation()


    return (
        <Form method="post" >
            <TableRow
                row={topping}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName} `}
                showDateColumns={false}
            >
                <div className="flex justify-center">
                    <Tooltip content="Editar">
                        <Button type="submit" size="sm" name="_action" value="catalog-create-add-pizza" >
                            <Check size={16} />
                        </Button>
                    </Tooltip>
                </div>
                <div>
                    <Input type="hidden" name="parentId" value={catalogId ?? ""} />
                    <Input type="hidden" name="product" value={jsonStringify(productSelected)} />
                    <Input type="hidden" name="size" value={jsonStringify(sizeSelected)} />
                    <Input type="hidden" name="topping" value={jsonStringify(topping)} />
                    <Input name="topping-name" defaultValue={topping.name} className="border-none w-full" readOnly />
                </div>
                <Select name="category">
                    <SelectTrigger>
                        <SelectValue placeholder="Categoria" className="text-xs text-muted" />
                    </SelectTrigger>
                    <SelectContent className={clazzName}>
                        <SelectGroup>
                            {categories && categories.map(c => {
                                return (
                                    <SelectItem key={c.id} value={jsonStringify(c) ?? ""}>
                                        {c.name}
                                    </SelectItem>
                                )

                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input name="unitPrice" type="text" className="w-full" />
                <Input name="unitPromotionalPrice" type="text" className="w-full" />
            </TableRow>
        </Form>
    )
}