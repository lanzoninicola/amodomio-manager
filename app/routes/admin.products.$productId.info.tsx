import { Form, useOutletContext } from "@remix-run/react";
import { Info } from "lucide-react";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Textarea } from "~/components/ui/textarea";
import { redirect, type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import { type ProductOutletContext } from "./admin.products.$productId";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { type Product, type ProductType } from "~/domain/product/product.model.server";
import { ProductEntity } from "~/domain/product/product.entity";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const productEntity = new ProductEntity()

    if (_action === "product-info-update") {

        const [err, data] = await tryit(productEntity.update(values.productId as string, {
            "info.productId": values.productId as string,
            "info.type": values.type as ProductType,
            "info.description": values.description as string,
        }))

        if (err) {
            return badRequest({ action: "product-info-update", message: errorMessage(err) })
        }

        return ok({ message: "Informaçẽs do produto atualizados com sucesso" })
    }

    if (_action === "product-delete") {

        const [err, data] = await tryit(productEntity.delete(values.productId as string))

        if (err) {
            return badRequest({ action: "product-delete", message: errorMessage(err) })
        }

        return redirect(`/admin/products`)
    }

    return null
}

export default function SingleProductInformation() {
    const context = useOutletContext<ProductOutletContext>()
    const product = context.product as Product
    const productTypes = context.productTypes
    const productInfo = product.info

    return (
        <div className="p-4">
            <Form method="post" className="w-full">
                <div className="mb-4 flex justify-end">
                    <div className="flex gap-2">
                        <SubmitButton actionName="product-delete" size="lg" idleText="Excluir" loadingText="Excluindo" variant={"destructive"} />
                        <SubmitButton actionName="product-info-update" size="lg" />
                    </div>
                </div>
                <div className="border-2 border-muted rounded-lg px-4 py-8">
                    <Input type="hidden" name="productId" defaultValue={product.id || undefined} />

                    <Fieldset>
                        <div className="flex justify-between items-start ">
                            <Label htmlFor="description" className="pt-2">Tipo</Label>
                            <div className="flex flex-col gap-2 w-[300px]">
                                <Select name="type" defaultValue={productInfo?.type} required >
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
                                    {/* <div className="flex gap-2 items-start">
                                        <Info size={24} />
                                        <p className="text-xs text-muted-foreground">
                                            <span className="text-xs text-muted-foreground font-semibold">Kit vs Fabricado:{" "}</span>
                                            diferente do fabricado, os componentes de um kit podem ser vendidos separadamente
                                        </p>
                                    </div> */}
                                </Select>
                            </div>
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="description" className="pt-2">Descrição produto</Label>
                            <Textarea id="description" name="description" placeholder="Descrição" defaultValue={productInfo?.description} className="max-w-[300px]" />
                        </div>
                    </Fieldset>
                </div>
            </Form>
        </div>
    )

}