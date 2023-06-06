import { Form, useLoaderData, useNavigation, useOutletContext, useSearchParams } from "@remix-run/react";
import { Loader, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { type ActionArgs } from "@remix-run/node";
import { ProductInfoModel, type ProductInfo } from "~/domain/product/product-info.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import { type ProductOutletContext } from "./admin.products.$productId";
import { type ProductWithAssociations } from "~/domain/product/product.entity";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";
import SubmitButton from "~/components/primitives/submit-button/submit-button";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "product-info-create") {

        console.log(values)

        const [err, data] = await tryit(ProductInfoModel.add({
            productId: values.productId,
            description: values.description,
            isAlternativeDescriptionOnMenu: values.isAlternativeDescriptionOnMenu === "on",
            alternativeDescriptionOnMenu: values.alternativeDescriptionOnMenu || "",
            isAlsoAnIngredient: values.isAlsoAnIngredient === "on",
            visibleOnMenu: values.visibleOnMenu === "on",
        }))

        if (err) {
            return badRequest({ action: "product-info-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Informaçẽs do produto criados com sucesso" })
    }

    if (_action === "product-info-update") {

        const [err, data] = await tryit(ProductInfoModel.update(values.id as string, {
            productId: values.productId,
            description: values.description,
            isAlternativeDescriptionOnMenu: values.isAlternativeDescriptionOnMenu === "on",
            alternativeDescriptionOnMenu: values.alternativeDescriptionOnMenu || "",
            isAlsoAnIngredient: values.isAlsoAnIngredient === "on",
            visibleOnMenu: values.visibleOnMenu === "on",
        }))

        if (err) {
            return badRequest({ action: "product-info-update", message: errorMessage(err) })
        }

        return ok({ message: "Informaçẽs do produto atualizados com sucesso" })
    }



    return null
}

export default function SingleProductInformation() {

    const context = useOutletContext<ProductOutletContext>()
    const product = context.product as ProductWithAssociations
    const productInfo = product.info
    const formActionSubmission = productInfo?.id ? "product-info-update" : "product-info-create"

    return (
        <div className="p-4">
            <Form method="post" className="w-full">
                <div className="mb-4">
                    <SubmitButton actionName={formActionSubmission} />
                </div>
                <div className="border-2 border-muted rounded-lg px-4 py-8">
                    <Input type="hidden" name="id" defaultValue={productInfo?.id} />
                    <Input type="hidden" name="productId" defaultValue={product.id || undefined} />

                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="description">Descrição produto</Label>
                            <Textarea id="description" name="description" placeholder="Descrição" defaultValue={productInfo?.description} className="max-w-[300px]" />
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="is-also-ingredient" className="text-sm">
                                E' tamben um ingrediente
                            </Label>
                            <Switch id="is-also-ingredient" name="isAlsoAnIngredient" defaultChecked={productInfo?.isAlsoAnIngredient} />
                        </div>
                    </Fieldset>
                </div>
            </Form>
        </div>
    )

}