import { Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { type ProductInfo, ProductInfoModel } from "~/data-access/models/product-info-model.server";
import { type ActionArgs } from "@remix-run/node";
import { badRequest, ok } from "~/lib/api-response";
import errorMessage from "~/lib/error-message";
import tryit from "~/lib/try-it";



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
    let [searchParams, _] = useSearchParams();
    const activeProductId = searchParams.get("id")
    const navigation = useNavigation()

    const loaderData = useLoaderData<typeof loader>()
    // const productsInfo: ProductInfo[] = loaderData?.productsInfo
    // const productInfo = productsInfo.find(p => p.productId === activeProductId)

    // const formActionSubmission = productInfo?.id ? "product-info-update" : "product-info-create"

    return (
        <div className="p-4">
            {/* <Form method="post" className="w-full">
                <div className="mb-4">
                    <Button type="submit" name="_action" value={formActionSubmission} disabled={navigation.state === "submitting" || navigation.state === "loading"} className="flex gap-2">
                        <Save size={16} />
                        Salvar
                    </Button>
                </div>
                <Input type="hidden" name="id" defaultValue={productInfo?.id} />
                <Input type="hidden" name="productId" defaultValue={activeProductId || undefined} />

                <div className="mb-4 w-full">
                    <Label htmlFor="description">Descrição produto</Label>
                    <Textarea id="description" name="description" placeholder="Descrição" defaultValue={productInfo?.description} className="w-full" />
                </div>
                <div className="grid grid-cols-2 gap-6 items-start">

                    <div>
                        <Fieldset>
                            <div className="flex justify-between">
                                <Label htmlFor="is-also-ingredient" className="text-sm">
                                    E' tamben um ingrediente
                                </Label>
                                <Switch id="is-also-ingredient" name="isAlsoAnIngredient" defaultChecked={productInfo?.isAlsoAnIngredient} />
                            </div>
                        </Fieldset>
                        <Fieldset>
                            <div className="flex justify-between">
                                <Label htmlFor="visible-on-menu" className="text-sm">
                                    Mostrar no cardapio
                                </Label>
                                <Switch id="visible-on-menu" name="visibleOnMenu" defaultChecked={productInfo?.visibleOnMenu} />
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </Form> */}
        </div>
    )
}