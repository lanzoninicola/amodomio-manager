import { type ActionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation, useOutletContext } from "@remix-run/react";
import { Check } from "lucide-react";
import { Table, TableRow, TableRows, TableTitles } from "~/components/primitives/table-list";
import Tooltip from "~/components/primitives/tooltip/tooltip";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Category } from "~/domain/category/category.model.server";
import errorMessage from "~/utils/error-message";
import type { HttpResponse } from "~/utils/http-response.server";
import { badRequest, ok } from "~/utils/http-response.server";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import toNumber from "~/utils/to-number";
import tryit from "~/utils/try-it";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";
import { pizzaCatalogEntity } from "~/domain/pizza-catalog/pizza-catalog.entity.server";
import type { Topping } from "~/domain/pizza/pizza.entity.server";
import { urlAt } from "~/utils/url";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const catalogId = urlAt(request.url, -5) as string
    const productId = urlAt(request.url, -3) as string
    const sizeId = urlAt(request.url, -1) as string


    if (_action === "catalog-create-add-topping") {
        // This action tell us that we are going to add a Pizza into the catalog

        const topping = jsonParse(values.topping as string) as Topping
        const categoryId = values.categoryId

        const toppingCatalog = {
            id: topping.id as string,
            categoryId: categoryId as string,
            unitPrice: toNumber(values.unitPrice as string),
            unitPromotionalPrice: toNumber(values.unitPromotionPrice as string),
        }

        const errorPayload = {
            message: "Nenhum sabor foi selecionado",
            payload: {
                action: "catalog-create-add-topping",
                toppingCatalog
            }
        }

        if (!topping) {
            return badRequest(errorPayload)
        }

        if (!categoryId) {
            return badRequest(errorPayload)
        }

        const [err, data] = await tryit(pizzaCatalogEntity.addToppingToCatalog(
            catalogId,
            productId,
            sizeId,
            toppingCatalog
        ))

        if (err) {
            return badRequest({
                message: errorMessage(err),
                payload: {
                    action: "catalog-create-add-topping",
                    toppingCatalog,
                }
            })
        }

        return ok({
            toppingCatalog
        })
    }

    return null
}


export default function ToopingsTab() {
    const context = useOutletContext()
    const toppings = context.toppings as Topping[] || []

    return (
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

    // after submit we need to update the category of the topping
    const actionData = useActionData<HttpResponse | undefined>()

    let isFormSubmissionError
    let toppingCatalog = actionData?.payload.toppingCatalog


    if (actionData && actionData.status !== 200) {
        isFormSubmissionError = true
    }



    return (
        <Form method="post" >
            <TableRow
                row={topping}
                isProcessing={navigation.state !== "idle"}
                isError={isFormSubmissionError && toppingCatalog?.id === topping.id}
                clazzName={`${clazzName}`}
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
                    <Input type="hidden" name="topping" value={jsonStringify(topping)} />
                    <Input name="topping-name" defaultValue={topping.name} className="border-none w-full" readOnly />
                </div>
                <Select name="categoryId" defaultValue={toppingCatalog?.categoryId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Categoria" className="text-xs text-muted" />
                    </SelectTrigger>
                    <SelectContent className={clazzName}>
                        <SelectGroup>
                            {categories && categories.map(c => {
                                return (
                                    <SelectItem key={c.id} value={c.id ?? ""}>
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