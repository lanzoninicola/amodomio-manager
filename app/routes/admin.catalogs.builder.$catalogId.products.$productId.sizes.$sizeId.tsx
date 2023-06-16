import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { type ActionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useOutletContext } from "@remix-run/react";
import { Check, Edit, Plus, RefreshCcw } from "lucide-react";
import { DeleteItemButton, Table, TableRow, TableRows, TableTitles } from "~/components/primitives/table-list";
import Tooltip from "~/components/primitives/tooltip/tooltip";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Category } from "~/domain/category/category.model.server";
import errorMessage from "~/utils/error-message";
import type { HttpResponse } from "~/utils/http-response.server";
import { badRequest, ok } from "~/utils/http-response.server";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import toNumber from "~/utils/to-number";
import tryit from "~/utils/try-it";
import type { PizzaToppingCatalog } from "~/domain/pizza-catalog/pizza-catalog.entity.server";
import { pizzaCatalogEntity } from "~/domain/pizza-catalog/pizza-catalog.entity.server";
import type { Topping } from "~/domain/pizza/pizza.entity.server";
import { urlAt } from "~/utils/url";
import type { ToppingSelectionOutletContext } from "./admin.catalogs.builder.$catalogId.products.$productId.sizes";

export const meta: V2_MetaFunction = () => {
    return [
        { title: "Catálogo - Seleçionar Sabores" },
    ];
};



export async function loader({ request }: LoaderArgs) {
    const catalogId = urlAt(request.url, -5) as string
    const productId = urlAt(request.url, -3) as string
    const sizeId = urlAt(request.url, -1) as string


    const productSizeToppings = await pizzaCatalogEntity.getToppingsFromCatalog(catalogId, productId, sizeId)

    return ok({ productSizeToppings })
}


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
            unitPromotionalPrice: toNumber(values.unitPromotionalPrice as string),
        }

        const errorPayload = {
            payload: {
                action: "catalog-create-add-topping",
                toppingCatalog
            }
        }

        if (!topping) {
            return badRequest({ ...errorPayload, message: "Nenhum sabor foi selecionado" })
        }

        if (!categoryId) {
            return badRequest({ ...errorPayload, message: "Nenhuma categoria foi selecionada" })
        }

        console.log({
            catalogId,
            productId,
            sizeId,
            toppingCatalog
        })

        const [err, data] = await tryit(pizzaCatalogEntity.addToppingToCatalog(
            catalogId,
            productId,
            sizeId,
            toppingCatalog
        ))

        if (err) {
            return badRequest({ ...errorPayload, message: errorMessage(err) })

        }

        return ok({
            toppingCatalog
        })
    }

    if (_action === "catalog-create-update-topping") {
        const topping = jsonParse(values.topping as string) as Topping
        const categoryId = values.categoryId

        const toppingCatalog = {
            id: topping.id as string,
            categoryId: categoryId as string,
            unitPrice: toNumber(values.unitPrice as string),
            unitPromotionalPrice: toNumber(values.unitPromotionalPrice as string),
        }

        const [err, data] = await tryit(pizzaCatalogEntity.updateToppingFromCatalog(
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
    const context = useOutletContext<ToppingSelectionOutletContext>()
    const toppings = context.toppings as Topping[] || []

    return (
        <Table>
            <TableTitles
                clazzName="grid-cols-5"
                titles={[
                    "Sabor",
                    "Categoria",
                    "Preço",
                    "Preço Promocional",
                    "Ações"
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

    const context = useOutletContext<ToppingSelectionOutletContext>()
    const categories = context.categories as Category[] || []

    // toppingCatalog is the topping that is already in the catalog
    // we need to update the category of this topping
    const loaderData = useLoaderData<typeof loader>()
    const productSizeToppings = loaderData?.payload.productSizeToppings as PizzaToppingCatalog[] || []
    const toppingInCatalog = productSizeToppings.find(t => t.id === topping.id)
    let isToppingInCatalog = false

    if (toppingInCatalog) {
        isToppingInCatalog = true
    }

    const formSubmissionAction = isToppingInCatalog ? "catalog-create-update-topping" : "catalog-create-add-topping"

    // after submit we need to update the category of the topping
    const actionData = useActionData<HttpResponse | undefined>()
    let isFormSubmissionError
    let formSubmissionErrorMessage

    if (actionData && actionData.status !== 200) {
        isFormSubmissionError = true
        formSubmissionErrorMessage = actionData.message
    }


    return (
        <Form method="post" >
            <TableRow
                row={topping}
                isProcessing={navigation.state !== "idle"}
                isError={isFormSubmissionError && toppingInCatalog?.id === topping.id}
                clazzName={`${clazzName}`}
                showDateColumns={false}
            >
                <div>
                    <Input type="hidden" name="topping" value={jsonStringify(topping)} />
                    <Input name="topping-name" defaultValue={topping.name} className="border-none w-full" readOnly />
                </div>
                <Select name="categoryId" defaultValue={toppingInCatalog?.categoryId}>
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
                <Input name="unitPrice" type="text" className="w-full" defaultValue={toppingInCatalog?.unitPrice || ""} />
                <Input name="unitPromotionalPrice" type="text" className="w-full" defaultValue={toppingInCatalog?.unitPromotionalPrice || ""} />
                <div className="flex justify-center gap-4">
                    <Tooltip content={isToppingInCatalog ? "Atualizar" : "Adiçionar"}>
                        <Button type="submit" size="sm" name="_action" value={formSubmissionAction} variant={"ghost"} >
                            {isToppingInCatalog ? <RefreshCcw size={16} /> : <Plus size={16} />}
                        </Button>
                    </Tooltip>
                    <DeleteItemButton actionName="catalog-create-remove-topping" />
                </div>

            </TableRow>
            {toppingInCatalog?.id === topping.id && formSubmissionErrorMessage && (
                <div className="ml-4">
                    <span className="text-sm font-semibold text-red-400">{formSubmissionErrorMessage}</span>
                </div>
            )}

        </Form>
    )
}