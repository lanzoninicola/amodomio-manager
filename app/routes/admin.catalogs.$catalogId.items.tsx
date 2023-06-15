import { Form, useNavigation, useOutletContext } from "@remix-run/react";
import type { CatalogOutletContext } from "./admin.catalogs.$catalogId";

import Container from "~/components/layout/container/container";
import { Table, TableTitles, TableRows, TableRow } from "~/components/primitives/table-list";
import type { CatalogItem, PizzasCatalogItem, Topping } from "~/domain/catalog/catalog.model.server";
import { Input } from "~/components/ui/input";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Edit, Save } from "lucide-react";
import Tooltip from "~/components/primitives/tooltip/tooltip";
import { Button } from "~/components/ui/button";
import type { ActionArgs } from "@remix-run/node";
import { catalogEntity } from "~/domain/catalog/catalog.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import type { Product } from "~/domain/product/product.model.server";
import type { Size } from "~/domain/size/size.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import toNumber from "~/utils/to-number";
import tryit from "~/utils/try-it";




export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "catalog-pizza-update-item-update") {
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

        const [err, data] = await tryit(catalogEntity.updateProductOnPizzaCatalog(catalogId, pizzaCatalogItem))

        if (err) {
            return badRequest({ action: "catalog-create-add-pizza", message: errorMessage(err) })
        }

        return ok()
    }

    return null
}

export default function SingleCatalogItems() {

    const context = useOutletContext<CatalogOutletContext>()
    const catalog = context.catalog
    const categories = context.categories

    const catalogItems = catalog?.items as PizzasCatalogItem[] ?? []

    return (
        <Container>
            <Table>
                <TableTitles
                    clazzName="grid-cols-7"
                    titles={[
                        "Ações",
                        "Produto",
                        "Tamanho",
                        "Sabor",
                        "Categoria",
                        "Preço",
                        "Preço Promocional",
                    ]}
                />
                <TableRows>
                    {catalog?.type === "pizza" && catalogItems.map((i, idx) => {
                        let item = i as PizzasCatalogItem
                        return <PizzaCatalogItemsTableRow key={idx} item={item} clazzName="grid-cols-7" />;
                    })}

                    {catalog?.type !== "pizza" && catalogItems.map((i, idx) => {
                        let item = i as CatalogItem
                        return <CatalogItemsTableRow key={idx} item={item} clazzName="grid-cols-7" />;
                    })}

                </TableRows>
            </Table>
        </Container>
    )
}

interface PizzaCatalogItemsTableRowProps {
    item: PizzasCatalogItem;
    clazzName?: string;
}

function PizzaCatalogItemsTableRow({ item, clazzName }: PizzaCatalogItemsTableRowProps) {
    const context = useOutletContext<CatalogOutletContext>()
    const catalog = context.catalog
    const categories = context.categories
    const navigation = useNavigation()

    return (
        <Form method="post" >
            <TableRow
                row={item}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName} `}
                showDateColumns={false}
            >
                <div>
                    <Input type="hidden" name="parentId" value={catalog?.id ?? ""} />
                    <Input type="hidden" name="product" value={jsonStringify(item.product)} />
                    <Input type="hidden" name="size" value={jsonStringify(item.size)} />
                    <Input type="hidden" name="topping" value={jsonStringify(item.topping)} />
                    <Tooltip content="Editar">
                        <Button type="submit" size="sm" name="_action" value="catalog-pizza-update-item-update" >
                            <Save size={16} />
                        </Button>
                    </Tooltip>
                </div>
                <Input name="product-name" defaultValue={item.product.name} className="border-none w-full" readOnly />
                <Input name="size-name" defaultValue={item.size.name} className="border-none w-full" readOnly />
                <Input name="topping-name" defaultValue={item.topping.name} className="border-none w-full" readOnly />
                <Select name="category" defaultValue={jsonStringify(item.category.id)}>
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
                <Input name="unitPrice" type="text" className="w-full" defaultValue={item.unitPrice} />
                <Input name="unitPromotionalPrice" type="text" className="w-full" defaultValue={item.unitPromotionPrice} />
            </TableRow>
        </Form>
    )
}

interface CatalogItemsTableRowProps {
    item: CatalogItem;
    clazzName?: string;
}

function CatalogItemsTableRow({ item, clazzName }: CatalogItemsTableRowProps) {
    const context = useOutletContext<CatalogOutletContext>()
    const catalog = context.catalog
    const categories = context.categories
    const navigation = useNavigation()


    return (
        <Form method="post" >
            <TableRow
                row={item}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName} `}
                showDateColumns={false}
            >
                <div>
                    <Input type="hidden" name="parentId" value={catalog?.id ?? ""} />
                    <Input type="hidden" name="product" value={jsonStringify(item.product)} />
                    <Tooltip content="Editar">
                        <Button type="submit" size="sm" name="_action" value="catalog-update-item-update" >
                            <Save size={16} />
                        </Button>
                    </Tooltip>
                </div>
                <Input name="product-name" defaultValue={item.product.name} className="border-none w-full" readOnly />
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