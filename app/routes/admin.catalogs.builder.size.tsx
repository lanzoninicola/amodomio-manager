import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useOutletContext, useSearchParams } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Size } from "~/domain/size/size.model.server";
import { jsonParse, jsonStringify } from "~/utils/json-helper";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);



    if (_action === "catalog-create-size-selected") {
        const catalogId = values.id as string
        const productId = values.productId as string
        const size = jsonParse(values.size as string) as Size

        return redirect(`/admin/catalogs/builder?catalogId=${catalogId}&productId=${productId}&sizeId=${size.id}&step=toppings-select`)
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
