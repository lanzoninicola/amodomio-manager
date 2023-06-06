
import { type ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { IngredientEntity } from "~/domain/ingredient/ingredient.entity";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "ingredient-create") {

        const ingredientEntity = new IngredientEntity()
        const [err, data] = await tryit(ingredientEntity.create({
            name: values.name as string,
        }))

        if (err) {
            return badRequest({ action: "ingredient-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Ingrediente criado com sucesso" })
    }

    return null
}


export default function SingleIngredientNew() {
    return (
        <Container>
            <Card>
                <CardHeader>
                    <CardTitle>Novo Ingrediente</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <Form method="post" >
                        <Fieldset>
                            <Label htmlFor="ingredient-name">Nome</Label>
                            <Input type="string" id="ingredient-name" placeholder="Nome ingrediente" name="name" required />
                        </Fieldset>
                        <div className="flex gap-2">
                            <SubmitButton actionName="ingredient-create" />
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </Container>
    )
}