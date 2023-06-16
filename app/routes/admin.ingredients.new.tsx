
import { type ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ingredientEntity } from "~/domain/ingredient/ingredient.entity";
import type { ProductUnit } from "~/domain/product/product.model.server";
import useFormResponse from "~/hooks/useFormResponse";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    return badRequest({ action: "ingredient-create", message: errorMessage("cucu") })

    // if (_action === "ingredient-create") {

    //     const [err, data] = await tryit(ingredientEntity.create({
    //         name: values.name as string,
    //         unit: values.unit as ProductUnit,
    //     }))

    //     if (err) {
    //         return badRequest({ action: "ingredient-create", message: errorMessage(err) })
    //     }

    //     return ok({ ...data, message: "Ingrediente criado com sucesso" })
    // }



}


export default function SingleIngredientNew() {

    const { isError, errorMessage, data } = useFormResponse()

    return (

        <Card>
            <CardHeader>
                <CardTitle>Novo Ingrediente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <Form method="post">
                    <div className="flex flex-col md:flex-row md:gap-x-2 mb-4 md:mb-[inherit]">
                        <Fieldset>
                            <Label htmlFor="product-name">Nome</Label>
                            <Input type="string" id="product-name" placeholder="Nome ingrediente" name="name" required className="w-full text-lg md:text-md" autoComplete="off" />
                        </Fieldset>
                        <Fieldset>
                            <div className="md:max-w-[150px]">
                                <Label htmlFor="unit">Unidade</Label>
                                <Select name="unit" required defaultValue="gr" >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar..." />
                                    </SelectTrigger>
                                    <SelectContent id="unit" >
                                        <SelectGroup >
                                            <SelectItem value="gr" >GR</SelectItem>
                                            <SelectItem value="un">UN</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Fieldset>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <SubmitButton actionName="ingredient-create" className="text-lg md:text-md w-full md:w-[150px] gap-2" size={"lg"} />
                    </div>
                    <div data-element="form-alert">
                        {isError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Erro!</strong>
                                <span className="block sm:inline">{errorMessage}</span>
                            </div>
                        )}

                    </div>
                </Form>
            </CardContent>
        </Card>
    )
}