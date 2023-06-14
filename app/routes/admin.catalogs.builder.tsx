import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { Check } from "lucide-react";
import { FormLabel } from "~/components/layout/form";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Table, TableRow, TableRows, TableTitles } from "~/components/primitives/table-list";
import Tooltip from "~/components/primitives/tooltip/tooltip";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { catalogEntity } from "~/domain/catalog/catalog.entity.server";
import type { Catalog, CatalogType, PizzasCatalogItem, Topping } from "~/domain/catalog/catalog.model.server";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import { ProductEntity } from "~/domain/product/product.entity";
import type { Product } from "~/domain/product/product.model.server";
import { SizeEntity } from "~/domain/size/size.entity.server";
import type { Size } from "~/domain/size/size.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import toNumber from "~/utils/to-number";
import tryit from "~/utils/try-it";


export async function loader() {
    const catalogs = await catalogEntity.findAll()
    const catalogTypes = catalogEntity.getCatalogTypes()
    const productEntity = new ProductEntity()
    const products = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "manufactured"
    }])
    const sizeEntity = new SizeEntity()
    const sizes = await sizeEntity.findAll()
    const categories = await categoryEntity.findAll()

    const toppings = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "group"
    }])


    return ok({ catalogs, catalogTypes, products, sizes, toppings, categories })
}


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "catalog-create") {

        const catalog: Catalog = {
            name: values.name as string,
            type: values.type as CatalogType,
        }

        const [err, data] = await tryit(catalogEntity.create(catalog))

        if (err) {
            return badRequest({ action: "catalog-create", message: errorMessage(err) })
        }

        return redirect(`/admin/catalogs/builder?catalogId=${data.id}&step=product-select`)
    }

    if (_action === "catalog-create-product-selected") {

        const catalogId = values.id as string
        const product = jsonParse(values.product as string) as Product

        return redirect(`/admin/catalogs/builder?catalogId=${catalogId}&productId=${product.id}&step=size-select`)
    }

    if (_action === "catalog-create-size-selected") {
        const catalogId = values.id as string
        const productId = values.productId as string
        const size = jsonParse(values.size as string) as Size

        return redirect(`/admin/catalogs/builder?catalogId=${catalogId}&productId=${productId}&sizeId=${size.id}&step=toppings-select`)
    }

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


export default function CatalogBuilder() {
    const [searchParams, setSearchParams] = useSearchParams()
    const step = searchParams.get("step")

    return (
        <>
            <CatalogForm />
            {step === "product-select" && <ProductSelectorBox />}
            {step === "size-select" && <SizeSelectorBox />}
            {step === "toppings-select" && <ToppingsSelectorBox />}
        </>
    )
}

function CatalogForm() {
    const loaderData = useLoaderData<typeof loader>()
    const catalogs = loaderData.payload.catalogs as Catalog[] || []
    const catalogTypes = loaderData.payload.catalogTypes as CatalogType[] || []

    const [searchParams, setSearchParams] = useSearchParams()

    const catalogId = searchParams.get("catalogId")
    const catalogEdit = catalogs.find((catalog) => catalog.id === catalogId)

    return (
        <Form method="post">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Gerador de catálogo</CardTitle>
                        <SubmitButton actionName="catalog-create" className="w-[150px] gap-2" />
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">

                    <div className="flex flex-wrap justify-between">
                        <div className="flex flex-col gap-4 mb-4 w-[40%]">
                            <Input type="hidden" id="id" name="id" defaultValue={catalogEdit?.id} />
                            <Fieldset>
                                <FormLabel htmlFor="catalog-type">Tipo</FormLabel>
                                <Select name="type" defaultValue={catalogEdit?.type} required  >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar..." />
                                    </SelectTrigger>
                                    <SelectContent  >
                                        <SelectGroup >
                                            {catalogTypes.map((type) => {
                                                return <SelectItem key={type} value={type}>{type}</SelectItem>
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Fieldset>
                            <Fieldset>
                                <Label htmlFor="catalog-name">Nome</Label>
                                <Input type="text" id="catalog-name" placeholder="Nome" name="name" defaultValue={catalogEdit?.name} required autoComplete="off" />
                            </Fieldset>
                        </div>
                        <CatalogList />
                    </div>
                </CardContent>


            </Card>
        </Form >
    )
}


function CatalogList() {
    const loaderData = useLoaderData<typeof loader>()
    const catalogs = loaderData.payload.catalogs as Catalog[] || []

    return (
        <div className="border-2 border-muted rounded-lg p-4 w-[40%]">

            <h2 className="text-sm font-semibold mb-2">Catálogos criados</h2>
            <ul className="grid grid-cols-3">
                {catalogs.map((catalog) => {
                    return (
                        <li key={catalog.id} >
                            <span className="text-xs">{catalog.name} ({catalog.type})</span>
                        </li>
                    )
                })}
            </ul>

        </div>
    )
}


function ProductSelectorBox() {
    const loaderData = useLoaderData<typeof loader>()
    const products = loaderData.payload.products as Product[] || []

    const [searchParams, setSearchParams] = useSearchParams()

    const catalogId = searchParams.get("catalogId")

    // after selected the product //
    const productId = searchParams.get("productId")
    const productSelected = products.find((p) => p.id === productId)

    return (
        <Form method="post">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Seleçionar Produto</CardTitle>
                    </div>
                </CardHeader>
                <CardContent >
                    <Input type="hidden" id="id" name="id" defaultValue={catalogId || undefined} />
                    <Fieldset>
                        <Select name="product" required defaultValue={jsonStringify(productSelected)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecionar..." />
                            </SelectTrigger>
                            <SelectContent  >
                                <SelectGroup >
                                    {products.map((p) => {
                                        return <SelectItem key={p.id} value={jsonStringify(p) ?? ""}>{p.name}</SelectItem>
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Fieldset>
                    <SubmitButton actionName="catalog-create-product-selected" className="w-[150px] gap-2" />
                </CardContent>

            </Card>

        </Form>
    )
}


function SizeSelectorBox() {

    const loaderData = useLoaderData<typeof loader>()
    const sizes = loaderData.payload.sizes as Size[] || []

    const [searchParams, setSearchParams] = useSearchParams()

    const catalogId = searchParams.get("catalogId")
    const productId = searchParams.get("productId")

    // after selected the product //
    const sizeId = searchParams.get("sizeId")
    const sizeSelected = sizes.find((s) => s.id === sizeId)

    return (
        <Form method="post">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Seleçionar Tamanho</CardTitle>
                    </div>
                </CardHeader>
                <CardContent >
                    <Input type="hidden" id="id" name="id" defaultValue={catalogId || undefined} />
                    <Input type="hidden" id="productId" name="productId" defaultValue={productId || undefined} />
                    <Fieldset>
                        <Select name="size" required defaultValue={jsonStringify(sizeSelected)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecionar..." />
                            </SelectTrigger>
                            <SelectContent  >
                                <SelectGroup >
                                    {sizes.map((s) => {
                                        return <SelectItem key={s.id} value={jsonStringify(s)}>{s.name}</SelectItem>
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Fieldset>
                    <SubmitButton actionName="catalog-create-size-selected" className="w-[150px] gap-2" />
                </CardContent>

            </Card>

        </Form>
    )
}


function ToppingsSelectorBox() {
    const loaderData = useLoaderData<typeof loader>()
    const toppings = loaderData.payload.toppings as Topping[] || []
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