import { Form, useOutletContext } from "@remix-run/react";
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
import { type ProductWithAssociations } from "~/domain/product/product.entity";
import { ProductMenuModel } from "~/domain/product/product-menu.model.server";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Vegan, WheatOff } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { CategorySelector } from "./admin.resources.categories-selector";
import type { Category } from "~/domain/category/category.model.server";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "product-menu-create") {

        const [err, data] = await tryit(ProductMenuModel.add({
            productId: values.productId,
            show: values.show,
            categoryId: values.categoryId,
            description: values.description,
            italianProductName: values.italianProductName,
            isVegetarian: values.isVegetarian,
            isGlutenFree: values.isGlutenFree
        }))

        if (err) {
            return badRequest({ action: "product-menu-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Informaçẽs do produto criados com sucesso" })
    }

    if (_action === "product-menu-update") {

        const [err, data] = await tryit(ProductMenuModel.update(values.id as string, {
            productId: values.productId,
            show: values.show || false,
            categoryId: values.categoryId || null,
            description: values.description || "",
            italianProductName: values.italianProductName || "",
            isVegetarian: values.isVegetarian || false,
            isGlutenFree: values.isGlutenFree || false
        }))

        if (err) {
            return badRequest({ action: "product-menu-update", message: errorMessage(err) })
        }

        return ok({ message: "Informaçẽs do produto atualizados com sucesso" })
    }

    return null
}

export default function SingleProductMenu() {

    const context = useOutletContext<ProductOutletContext>()
    const product = context.product as ProductWithAssociations
    const categories = context.categories as Category[]
    const productMenu = product.menu
    const formActionSubmission = productMenu?.id ? "product-menu-update" : "product-menu-create"


    return (
        <div className="p-4">
            <Form method="post" className="w-full">
                <div className="mb-4 flex justify-end">
                    <SubmitButton actionName={formActionSubmission} size="lg" />
                </div>
                <div className="flex flex-col gap-2 border-2 border-muted rounded-lg px-4 py-8">
                    <Fieldset>
                        <Input type="hidden" name="id" defaultValue={productMenu?.id} />
                        <Input type="hidden" name="productId" defaultValue={product.id || undefined} />
                        <Fieldset>
                            <div className="flex justify-between   items-center">
                                <Label htmlFor="show-on-menu" className="text-sm">
                                    Mostrar no cardapio
                                </Label>
                                <Switch id="show-on-menu" name="show" defaultChecked={productMenu?.show} />
                            </div>
                        </Fieldset>
                        <Fieldset>
                            <div className="flex justify-between items-center">
                                <Label htmlFor="category" className="text-sm">
                                    Categoria
                                </Label>
                                <div className="w-[300px]">
                                    <Select name="categoryId" defaultValue={productMenu?.categoryId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleçionar categoria" className="text-xs text-muted" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categories && categories.map(c => {

                                                    if (c?.id === undefined) {
                                                        return null
                                                    }

                                                    return (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            {c.name}
                                                        </SelectItem>
                                                    )

                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                        </Fieldset>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" name="description" placeholder="Descrição" defaultValue={productMenu?.description} className="max-w-[300px]" />
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="italian-product-name">Nome produto em italiano</Label>
                            <Input id="italian-product-name" name="italian-product-name" placeholder="Nome" defaultValue={productMenu?.italianProductName} className="max-w-[300px]" />
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="is-vegetarian" className="flex gap-2 items-center">
                                <span>Vegetariano</span>
                                <Vegan size={"24"} />
                            </Label>
                            <Switch id="is-vegetarian" name="isVegetarian" defaultChecked={productMenu?.isVegetarian} />
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="is-gluten-free" className="flex gap-2 items-center">
                                <span>Sem Gluten</span>
                                <WheatOff size={"24"} />
                            </Label>
                            <Switch id="is-gluten-free" name="isGlutenFree" defaultChecked={productMenu?.isGlutenFree} />
                        </div>
                    </Fieldset>
                </div>


            </Form>
        </div>
    )

}