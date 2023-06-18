
import type { V2_MetaFunction } from "@remix-run/node";
import { type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { AlertError, AlertOk } from "~/components/layout/alerts/alerts";
import AutoCompleteDropdown from "~/components/primitives/autocomplete-dropdown/autocomplete-dropdown";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Ingredient } from "~/domain/ingredient/ingredient.entity";
import { ingredientEntity } from "~/domain/ingredient/ingredient.entity";
import UnitSelector from "~/domain/product/component/unit-selector/unit-selector";
import type { ProductUnit } from "~/domain/product/product.model.server";
import useFormResponse from "~/hooks/useFormResponse";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";


export const meta: V2_MetaFunction = () => {
    return [
        { title: "A Modo Mio - Novo ingrediente" },
    ];
};



export async function loader() {
    const ingredients = await ingredientEntity.findAll()
    return ok({ ingredients })
}


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "ingredient-create") {

        const [err, data] = await tryit(ingredientEntity.create({
            name: values.name as string,
            unit: values.unit as ProductUnit,
        }))

        if (err) {
            return badRequest({ action: "ingredient-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Ingrediente criado com sucesso" })
    }

}


export default function SingleIngredientNew() {
    const loaderData = useLoaderData<typeof loader>()
    const ingredients = loaderData.payload.ingredients as Ingredient[] || []

    const [ingredientValues, setIngredientValues] = useState<Ingredient["name"]>("")

    const { isError, isOk, errorMessage, formRef, inputFocusRef } = useFormResponse()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Novo Ingrediente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <Form method="post" ref={formRef}>
                    <div className="flex flex-col md:flex-row md:gap-x-2 mb-4 md:mb-[inherit]">

                        <Fieldset>
                            <div className="relative">
                                <Label htmlFor="product-name">Nome</Label>
                                <Input type="text" id="product-name" placeholder="Nome ingrediente" name="name" required
                                    className="w-full text-lg md:text-md" autoComplete="off"
                                    onChange={(e) => setIngredientValues(e.target.value)}
                                    ref={inputFocusRef}
                                />
                                <AutoCompleteDropdown dataset={ingredients} fieldToSearch={"name"} searchValue={ingredientValues} title="O ingrediente já existe" />
                            </div>
                        </Fieldset>

                        <UnitSelector />
                    </div>
                    <div className="flex gap-2 mb-4">
                        <SubmitButton actionName="ingredient-create" className="text-lg md:text-md w-full md:w-[150px] gap-2" size={"lg"} />
                    </div>
                    <div data-element="form-alert">
                        {isError && (<AlertError message={errorMessage} />)}
                        {isOk && (<AlertOk message={"Ingrediente criado com successo"} />)}
                    </div>
                </Form>
                <IngredientQuickList />
            </CardContent>
        </Card>
    )
}

function IngredientQuickList() {
    const loaderData = useLoaderData<typeof loader>()
    const ingredients = loaderData.payload.ingredients as Ingredient[] || []

    if (!ingredients || ingredients.length === 0) {
        return null
    }

    return (
        <div>
            <h3 className="text-sm font-bold mb-4">Ingredientes cadastrados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:w-1/2">
                {ingredients.map(ingredient => (
                    <span key={ingredient.id} className="text-xs md:text-sm p-1">{ingredient.name}</span>
                ))}
            </div>
        </div>
    )
}

