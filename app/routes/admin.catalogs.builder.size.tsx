import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useOutletContext, useSearchParams } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";
import errorMessage from "~/utils/error-message";
import { badRequest } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import { pizzaCatalogEntity } from "~/domain/pizza-catalog/pizza-catalog.entity.server";
import type { PizzaSizeVariation } from "~/domain/pizza/pizza.entity.server";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "catalog-create-size-selected") {
        const catalogId = values.id as string
        const productId = values.productId as string
        const size = jsonParse(values.size as string) as PizzaSizeVariation

        const [err, data] = await tryit(pizzaCatalogEntity.bindSizeToProductCatalog(catalogId, productId, size.id as string))

        if (err) {
            return badRequest({ action: "catalog-create", message: errorMessage(err) })
        }

        return redirect(`/admin/catalogs/builder/toppings?catalogId=${catalogId}&productId=${productId}&sizeId=${size.id}`)
    }

    return null
}


export default function SizeTab() {

    const context = useOutletContext<CatalogBuilderOutletContext>()
    const sizes = context.sizes

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
                                        return <SelectItem key={s.id} value={jsonStringify(s) ?? ""}>{s.name}</SelectItem>
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
