import { Form, useLoaderData, useNavigation, useOutletContext, useSearchParams } from "@remix-run/react";
import { Info, Loader, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import { type ProductOutletContext } from "./admin.products.$productId";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ProductModel, type Product, type ProductInfo, type ProductType } from "~/domain/product/product.model.server";
import { ProductEntity } from "~/domain/product/product.entity";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const productEntity = new ProductEntity()

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

export default function SingleProductInformation() {
    const context = useOutletContext<ProductOutletContext>()
    const product = context.product as Product
    const productInfo = product.info

    return (
        <div className="p-4">
            <Form method="post" className="w-full">
                <div className="mb-4 flex justify-end">
                    <SubmitButton actionName="product-info-update" size="lg" />
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
                                            <SelectItem value="simple">Simples</SelectItem>
                                            <SelectItem value="kit">Kit</SelectItem>
                                            <SelectItem value="manufactured">Fabricado</SelectItem>
                                            <SelectItem value="semi_manufactured">Semiacabado</SelectItem>
                                            <SelectItem value="raw_material">Matéria Prima</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                    <div className="flex gap-2 items-start">
                                        <Info size={24} />
                                        <p className="text-xs text-muted-foreground">
                                            <span className="text-xs text-muted-foreground font-semibold">Kit vs Fabricado:{" "}</span>
                                            diferente do fabricado, os componentes de um kit podem ser vendidos separadamente
                                        </p>
                                    </div>
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