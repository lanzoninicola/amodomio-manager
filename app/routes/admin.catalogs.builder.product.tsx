import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Product } from "~/domain/product/product.model.server";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";



export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "catalog-create-product-selected") {

        const catalogId = values.id as string
        const product = jsonParse(values.product as string) as Product

        return redirect(`/admin/catalogs/builder?catalogId=${catalogId}&productId=${product.id}&step=size-select`)
    }



    return null
}


export default function ProductSelectorBox() {
    const context = useOutletContext<CatalogBuilderOutletContext>()
    const products = context.products

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

