
import type { V2_MetaFunction } from "@remix-run/node";
import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
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
import type { ProductComponent, ProductUnit } from "~/domain/product/product.model.server";
import useFormResponse from "~/hooks/useFormResponse";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import Folder from "~/components/primitives/folder/folder";
import { ComponentSelector } from "./admin.resources.component-selector";
import type { TabItem } from "~/components/primitives/tabs/tabs";
import Tabs from "~/components/primitives/tabs/tabs";
import toLowerCase from "~/utils/to-lower-case";
import trim from "~/utils/trim";
import { ProductEntity } from "~/domain/product/product.entity";
import { jsonParse } from "~/utils/json-helper";
import { ChevronRight, Delete } from "lucide-react";
import { DeleteItemButton } from "~/components/primitives/table-list";


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
            name: trim(values.name as string),
            unit: "un",
        }))

        if (err) {
            return badRequest({ action: "topping-create", message: errorMessage(err) })
        }

        return redirect(`/admin/toppings/new?tab=component&parentId=${data.id}&name=${data.name}`)
    }

    if (_action === "topping-delete") {

        const [err, data] = await tryit(toppingEntity.delete(values.id as string))

        if (err) {
            return badRequest({ action: "topping-delete", message: errorMessage(err) })
        }

        return ok({ message: "Elemento adicionado com sucesso" })
    }

    const productEntity = new ProductEntity()
    const parentProductId = values.parentId as string

    if (!parentProductId) {
        return badRequest({ action: "composition-add-component", message: "O ID do produto não foi informado" })
    }

    if (_action === "composition-add-component") {

        const component = jsonParse(values.component)

        if (!component) {
            return badRequest({ action: "composition-add-component", message: "Occorreu um erro adicionando o componente" })
        }

        const newComponent: ProductComponent = {
            parentId: parentProductId,
            product: {
                id: component.id as string,
            },
            quantity: 0,
            unit: component.unit as ProductUnit,
            unitCost: 0,
        }

        const [err, data] = await tryit(productEntity.addComponent(parentProductId, newComponent))

        if (err) {
            return badRequest({ action: "composition-add-component", message: errorMessage(err) })
        }

        return ok({ message: "Elemento adicionado com sucesso" })
    }

    return null

}


export default function SingleToppingNew() {
    const loaderData = useLoaderData<typeof loader>()
    const toppings = loaderData.payload.toppings as Topping[] || []

    const [toppingValues, setToppingValues] = useState<Topping["name"]>("")

    const { isError, isOk, errorMessage, formRef, data: formResponseData } = useFormResponse()

    // this is used when a sub-component is created,
    // so we can redirect back here and we repopulate the input with the last value
    const [searchParam, setSearchParam] = useSearchParams()
    const toppingName = searchParam.get("name")
    const currentTab = searchParam.get("tab") ?? "list"
    const currentToppingId = searchParam.get("parentId")


    const tabs: TabItem[] = [
        { id: "list", name: "Lista sabores", default: true },
        { id: "component", name: "Ingredientes" },
    ]
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
                                    onChange={(e) => {
                                        const toppingName = e.target.value.trim()
                                        setToppingValues(toppingName)
                                    }}
                                    defaultValue={toppingName ?? undefined}
                                />
                                <AutoCompleteDropdown dataset={toppings} fieldToSearch={"name"} searchValue={toppingValues} title="Verifica aqui abaixo se o sabor já existe:" />
                            </div>
                        </Fieldset>

                    </div>
                    <div className="flex gap-2 mb-4">
                        <SubmitButton
                            actionName="topping-create"
                            className="text-lg md:text-md w-full md:w-[150px] gap-2" size={"lg"}
                            disableLoadingAnimation={currentTab !== "" && currentToppingId !== null}
                            disabled={currentTab === "component" && currentToppingId !== null}
                        />
                    </div>
                    <div data-element="form-alert">
                        {isError && (<AlertError message={errorMessage} />)}
                        {isOk && (<AlertOk message={formResponseData?.message || "Operação concluida com successo"} />)}
                    </div>
                </Form>
                <div>
                    <Tabs tabs={tabs} />
                    {currentTab === "list" && <ToppingQuickList />}
                    {currentTab === "component" && currentToppingId &&
                        <ComponentSelector
                            parentId={currentToppingId}
                            hideAlphabetSelector={true}
                            newComponentLink={`/admin/products/new?type=ingredient&redirectUrl=/admin/toppings/new?name=${toppingValues}`}
                            title="Adiçionar ingrediente"
                        />}
                </div>
            </CardContent>
        </Card>
    )
}

function ToppingQuickList() {
    const loaderData = useLoaderData<typeof loader>()
    const toppings = loaderData.payload.toppings as Topping[] || []

    const [clickedAmount, setClickedAmount] = useState({} as Record<string, number>)

    if (!toppings || toppings.length === 0) {
        return null
    }

    function increaseAmount(toppingId: string) {
        if (!toppingId) return

        const amount = clickedAmount[toppingId] ?? 0
        if (amount === 2) {
            setClickedAmount({ ...clickedAmount, [toppingId]: 0 })
            return
        }
        setClickedAmount({ ...clickedAmount, [toppingId]: amount + 1 })
    }

    return (

        <ul className="grid grid-cols-2 md:grid-cols-4 lg:w-1/2">
            {toppings.map(topping => {
                if (!topping.id) return null

                return (
                    <li key={topping.id} className="bg-secondary mr-2 mb-3 px-2 rounded-md" >
                        <Form method="post" >
                            <div className="flex justify-between items-center py-2">
                                <input type="hidden" name="id" value={topping.id} />
                                <div className="flex gap-2 justify-between w-full" onClick={() => increaseAmount(topping.id as string)}>
                                    <span className="text-xs md:text-sm">{topping.name}</span>
                                    {clickedAmount[topping.id] !== 2 && <ChevronRight size={14} />}
                                </div>
                                {clickedAmount[topping.id] === 2 && <DeleteItemButton iconSize={14} actionName="topping-delete" />}
                            </div>
                        </Form>

                    </li>
                )
            })}
        </ul >
    )
}

