import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import UnitSelector from "~/domain/product/component/unit-selector/unit-selector";
import type { ProductTypeHTMLSelectOption } from "~/domain/product/product.entity";
import { ProductEntity } from "~/domain/product/product.entity";
import type { ProductType, ProductUnit } from "~/domain/product/product.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";


export async function loader() {
    const productTypes = ProductEntity.getProductTypeRawValues()

    return ok({ productTypes })

}


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "product-create") {

        const productEntity = new ProductEntity()
        const [err, data] = await tryit(productEntity.create({
            name: values.name as string,
            unit: values.unit as ProductUnit,
            info: {
                type: values.type as ProductType,
            }
        }))

        if (err) {
            return badRequest({ action: "product-create", message: errorMessage(err) })
        }

        if (values.redirectUrl) {
            return redirect(values.redirectUrl as string)
        }

        return redirect(`/admin/products/${data.id}/info`)
    }

    return null
}


export default function SingleProductNew() {
    const loaderData = useLoaderData<typeof loader>()
    const productTypes = loaderData.payload.productTypes as ProductTypeHTMLSelectOption[]

    const [searchParam, setSearchParam] = useSearchParams()
    const type = productTypes.find(type => type.value === searchParam.get("type"))
    const typeOption = type?.value

    const redirectUrl = searchParam.get("redirectUrl") ?? undefined

    return (
        <Card>
            <CardHeader>
                <CardTitle>Novo Produto</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <Form method="post"  >
                    <div className="mb-6 md:mb-[inherit]">
                        <div className="flex flex-col md:flex-row md:gap-x-2 ">
                            <Fieldset>
                                <Input type="hidden" name="redirectUrl" value={redirectUrl} />
                                <Label htmlFor="product-name">Nome</Label>
                                <Input type="text" id="product-name" placeholder="Nome produto" name="name" required autoComplete="off" />
                            </Fieldset>
                            <UnitSelector />
                        </div>
                        <Fieldset>
                            <Label htmlFor="description" className="pt-2">Tipo</Label>
                            <div className="flex flex-col gap-2 md:w-[300px]">
                                <Select name="type" required defaultValue={typeOption ?? undefined} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup >
                                            {productTypes && productTypes.map((type, idx) => {
                                                return <SelectItem key={idx} value={type.value}>{type.label}</SelectItem>
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Fieldset>
                    </div>
                    <div className="flex gap-2">
                        <SubmitButton actionName="product-create" />
                    </div>
                </Form>
            </CardContent>
        </Card>

    )
}