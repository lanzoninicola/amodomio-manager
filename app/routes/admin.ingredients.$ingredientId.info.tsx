import { Form, useOutletContext } from "@remix-run/react";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Textarea } from "~/components/ui/textarea";
import { type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { IngredientWithAssociations } from "~/domain/ingredient/ingredient.entity";
import { IngredientEntity } from "~/domain/ingredient/ingredient.entity";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import type { IngredientOutletContext } from "./admin.ingredients.$ingredientId";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);
    const ingredientEntity = new IngredientEntity()

    if (_action === "ingredient-info-create") {
        const [err, data] = await tryit(ingredientEntity.addInfo({
            ingredientId: values.ingredientId as string,
            description: values.description as string,
        }))

        if (err) {
            return badRequest({ action: "ingredient-info-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Informaçẽs do ingrediente criados com sucesso" })
    }

    if (_action === "ingredient-info-update") {

        const [err, data] = await tryit(ingredientEntity.updateInfo(values.id as string, {
            ingredientId: values.ingredientId as string,
            description: values.description as string,
        }))

        if (err) {
            return badRequest({ action: "ingredient-info-update", message: errorMessage(err) })
        }

        return ok({ message: "Informaçẽs do ingrediente atualizados com sucesso" })
    }



    return null
}

export default function SingleIngredientInformation() {

    const context = useOutletContext<IngredientOutletContext>()
    const ingredient = context.ingredient as IngredientWithAssociations
    const ingredientInfo = ingredient.info
    const formActionSubmission = ingredientInfo?.id ? "ingredient-info-update" : "ingredient-info-create"

    return (
        <div className="p-4">
            <Form method="post" className="w-full">
                <div className="mb-4 flex justify-end">
                    <SubmitButton actionName={formActionSubmission} size="lg" />
                </div>
                <div className="border-2 border-muted rounded-lg px-4 py-8">
                    <Input type="hidden" name="id" defaultValue={ingredientInfo?.id} />
                    <Input type="hidden" name="ingredientId" defaultValue={ingredient.id || undefined} />

                    <Fieldset>
                        <div className="flex justify-between">
                            <Label htmlFor="description">Descrição produto</Label>
                            <Textarea id="description" name="description" placeholder="Descrição" defaultValue={ingredientInfo?.description} className="max-w-[300px]" />
                        </div>
                    </Fieldset>
                </div>
            </Form>
        </div>
    )

}