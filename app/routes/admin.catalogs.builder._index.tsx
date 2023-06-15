import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useOutletContext, useSearchParams } from "@remix-run/react";
import { FormLabel } from "~/components/layout/form";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { catalogEntity } from "~/domain/catalog/catalog.entity.server";
import type { Catalog, CatalogType } from "~/domain/catalog/catalog.model.server";
import { categoryEntity } from "~/domain/category/category.entity.server";
import { ProductEntity } from "~/domain/product/product.entity";
import { SizeEntity } from "~/domain/size/size.entity.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";


export async function loader() {
    const catalogs = await catalogEntity.findAll()
    const catalogTypes = catalogEntity.getCatalogTypes()
    const productEntity = new ProductEntity()
    const products = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "pizza"
    }])
    const sizeEntity = new SizeEntity()
    const sizes = await sizeEntity.findAll()
    const categories = await categoryEntity.findAll()

    const toppings = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "topping"
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

        return redirect(`/admin/catalogs/builder/product?catalogId=${data.id}`)
    }


    return null
}


export default function CatalogForm() {
    const context = useOutletContext<CatalogBuilderOutletContext>()
    const catalogs = context.catalogs
    const catalogTypes = context.catalogTypes

    const [searchParams, setSearchParams] = useSearchParams()
    const catalogId = searchParams.get("catalogId")
    const catalogEdit = catalogs.find((catalog) => catalog.id === catalogId)

    return (
        <Form method="post">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Novo catálogo</CardTitle>
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
                        <CatalogListBox />
                    </div>
                </CardContent>
            </Card>
        </Form >
    )
}


function CatalogListBox() {
    const context = useOutletContext<CatalogBuilderOutletContext>()
    const catalogs = context.catalogs

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

