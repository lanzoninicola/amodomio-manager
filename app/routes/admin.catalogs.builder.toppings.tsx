import { type ActionArgs } from "@remix-run/node";
import { Form, useNavigation, useOutletContext, useSearchParams } from "@remix-run/react";
import { Check } from "lucide-react";
import { Table, TableRow, TableRows, TableTitles } from "~/components/primitives/table-list";
import Tooltip from "~/components/primitives/tooltip/tooltip";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Category, CategoryMenu } from "~/domain/category/category.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import toNumber from "~/utils/to-number";
import tryit from "~/utils/try-it";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";
import { pizzaCatalogEntity } from "~/domain/pizza-catalog/pizza-catalog.entity.server";
import type { Topping } from "~/domain/pizza/pizza.entity.server";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);


    if (_action === "catalog-create-add-topping") {
        // This action tell us that we are going to add a Pizza into the catalog

        const catalogId = values.catalogId as string
        const productId = values.productId as string
        const sizeId = values.sizeId as string
        const topping = jsonParse(values.topping as string) as Topping
        const category = jsonParse(values.category as string) as CategoryMenu

        const unitPrice = toNumber(values.unitPrice as string)
        const unitPromotionalPrice = toNumber(values.unitPromotionPrice as string)

        if (!topping) {
            return badRequest({ action: "catalog-create-add-topping", message: "Nenhum sabor foi selecionado" })
        }

        if (!category) {
            return badRequest({ action: "catalog-create-add-topping", message: "Nenhuma categoria foi selecionada" })
        }

        const [err, data] = await tryit(pizzaCatalogEntity.addToppingToCatalog(
            catalogId,
            productId,
            sizeId,
            topping.id as string,
            category.id as string,
            unitPrice,
            unitPromotionalPrice
        ))

        if (err) {
            return badRequest({ action: "catalog-create-add-topping", message: errorMessage(err) })
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
    const navigation = useNavigation()

    const context = useOutletContext<CatalogBuilderOutletContext>()
    const categories = context.categories as Category[] || []

    const [searchParams, setSearchParams] = useSearchParams()
    const catalogId = searchParams.get("catalogId") as string
    const productId = searchParams.get("productId") as string
    const sizeId = searchParams.get("sizeId") as string


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
                        <Button type="submit" size="sm" name="_action" value="catalog-create-add-topping" >
                            <Check size={16} />
                        </Button>
                    </Tooltip>
                </div>
                <div>
                    <Input type="hidden" name="catalogId" value={catalogId} />
                    <Input type="hidden" name="productId" value={productId} />
                    <Input type="hidden" name="sizeId" value={sizeId} />
                    <Input type="hidden" name="topping" value={jsonStringify(topping)} />
                    <Input name="topping-name" defaultValue={topping.name} className="border-none w-full" readOnly />
                </div>
                <Select name="category" defaultValue={jsonStringify(topping.menu?.category)}>
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