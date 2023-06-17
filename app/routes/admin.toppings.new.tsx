
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
import type { Topping } from "~/domain/topping/topping.entity";
import { toppingEntity } from "~/domain/topping/topping.entity";
import type { ProductUnit } from "~/domain/product/product.model.server";
import useFormResponse from "~/hooks/useFormResponse";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import Folder from "~/components/primitives/folder/folder";
import { ComponentSelector } from "./admin.resources.component-selector";


export const meta: V2_MetaFunction = () => {
    return [
        { title: "A Modo Mio - Novo sabor" },
    ];
};



export async function loader() {
    const toppings = await toppingEntity.findAll()
    return ok({ toppings })
}


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "topping-create") {

        const [err, data] = await tryit(toppingEntity.create({
            name: values.name as string,
            unit: values.unit as ProductUnit,
        }))

        if (err) {
            return badRequest({ action: "topping-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Sabor criado com sucesso" })
    }

}


export default function SingleToppingNew() {
    const loaderData = useLoaderData<typeof loader>()
    const toppings = loaderData.payload.toppings as Topping[] || []

    const [toppingValues, setToppingValues] = useState<Topping["name"]>("")

    const { isError, isOk, errorMessage, formRef, inputFocusRef } = useFormResponse()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Novo Sabor</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <Form method="post" ref={formRef}>
                    <div className="flex flex-col md:flex-row md:gap-x-2 mb-4 md:mb-[inherit]">

                        <Fieldset>
                            <div className="relative">
                                <Label htmlFor="product-name">Nome</Label>
                                <Input type="text" id="product-name" placeholder="Nome sabor" name="name" required
                                    className="w-full text-lg md:text-md" autoComplete="off"
                                    onChange={(e) => setToppingValues(e.target.value)}
                                    ref={inputFocusRef}
                                />
                                <AutoCompleteDropdown dataset={toppings} fieldToSearch={"name"} searchValue={toppingValues} title="O sabor já existe" />
                            </div>
                        </Fieldset>

                    </div>
                    <div className="flex gap-2 mb-4">
                        <SubmitButton actionName="topping-create" className="text-lg md:text-md w-full md:w-[150px] gap-2" size={"lg"} />
                    </div>
                    <div data-element="form-alert">
                        {isError && (<AlertError message={errorMessage} />)}
                        {isOk && (<AlertOk message={"Sabor criado com successo"} />)}
                    </div>
                </Form>
                <ToppingQuickList />
                <ComponentSelector parentId={"123"} hideAlphabetSelector={true} />
            </CardContent>
        </Card>
    )
}

function ToppingQuickList() {
    const loaderData = useLoaderData<typeof loader>()
    const toppings = loaderData.payload.toppings as Topping[] || []

    if (!toppings || toppings.length === 0) {
        return null
    }

    return (
        <div className="w-full border-2 border-muted rounded-lg">
            <Folder title="Sabores cadastrados">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:w-1/2">
                    {toppings.map(topping => (
                        <span key={topping.id} className="text-xs md:text-sm p-1">{topping.name}</span>
                    ))}
                </div>
            </Folder>
        </div>
    )
}

