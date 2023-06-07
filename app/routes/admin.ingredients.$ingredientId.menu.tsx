import { type ActionArgs } from "@remix-run/node";
import { useOutletContext, Form } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { IngredientEntity } from "~/domain/ingredient/ingredient.entity";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { IngredientOutletContext } from "./admin.ingredients.$ingredientId";
import type { IngredientWithAssociations } from "~/domain/ingredient/ingredient.entity";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Vegan, WheatOff } from "lucide-react";




export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const ingredientEntity = new IngredientEntity()

    if (_action === "ingredient-menu-info-create") {
        const [err, data] = await tryit(ingredientEntity.addMenuInfo({
            ingredientId: values.ingredientId as string,
            description: values.description as string,
            italianIngredientName: values.italianIngredientName as string,
            isVegetarian: values.isVegetarian === "on" ? true : false,
            isGlutenFree: values.isGlutenFree === "on" ? true : false,
        }))

        if (err) {
            return badRequest({ action: "ingredient-menu-info-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Informaçẽs do cardápio criados com sucesso" })
    }

    if (_action === "ingredient-menu-info-update") {

        const [err, data] = await tryit(ingredientEntity.updateMenuInfo(values.id as string, {
            ingredientId: values.ingredientId as string,
            description: values.description as string,
            italianIngredientName: values.italianIngredientName as string,
            isVegetarian: values.isVegetarian === "on" ? true : false,
            isGlutenFree: values.isGlutenFree === "on" ? true : false,
        }))

        if (err) {
            return badRequest({ action: "ingredient-menu-info-update", message: errorMessage(err) })
        }

        return ok({ message: "Informaçẽs do cardápio atualizados com sucesso" })
    }

    return null
}

export default function SingleIngredientMenu() {

    const context = useOutletContext<IngredientOutletContext>()
    const ingredient = context.ingredient as IngredientWithAssociations
    const ingredientMenuInfo = ingredient.menuInfo
    const formActionSubmission = ingredientMenuInfo?.id ? "ingredient-menu-info-update" : "ingredient-menu-info-create"


    return (
        <div className="p-4">
            <Form method="post" className="w-full">
                <div className="mb-6 flex justify-end">
                    <SubmitButton actionName={formActionSubmission} size="lg" />
                </div>
                <div className="flex flex-col gap-2 border-2 border-muted rounded-lg px-4 py-8">
                    <Fieldset>
                        <Input type="hidden" name="id" defaultValue={ingredientMenuInfo?.id} />
                        <Input type="hidden" name="ingredientId" defaultValue={ingredient.id || undefined} />
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" name="description" placeholder="Descrição" defaultValue={ingredientMenuInfo?.description} className="max-w-[300px]" />
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="italian-ingredient-name">Nome produto em italiano</Label>
                            <Input id="italian-ingredient-name" name="italianIngredientName" placeholder="Nome" defaultValue={ingredientMenuInfo?.italianIngredientName} className="max-w-[300px]" />
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="is-vegetarian" className="flex gap-2 items-center">
                                <span>Vegetariano</span>
                                <Vegan size={"24"} />
                            </Label>
                            <Switch id="is-vegetarian" name="isVegetarian" defaultChecked={ingredientMenuInfo?.isVegetarian} />
                        </div>
                    </Fieldset>
                    <Fieldset>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="is-gluten-free" className="flex gap-2 items-center">
                                <span>Sem Gluten</span>
                                <WheatOff size={"24"} />
                            </Label>
                            <Switch id="is-gluten-free" name="isGlutenFree" defaultChecked={ingredientMenuInfo?.isGlutenFree} />
                        </div>
                    </Fieldset>
                </div>


            </Form>
        </div>
    )

}