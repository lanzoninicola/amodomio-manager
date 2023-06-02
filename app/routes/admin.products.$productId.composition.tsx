
import { Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { type ProductComposition, ProductCompositionModel } from "~/data-access/models/product-composition-model.server";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import uppercase from "~/utils/to-uppercase";
import { json, type ActionArgs } from "@remix-run/node";
import { badRequest, ok, serverError } from "~/lib/api-response";
import errorMessage from "~/lib/error-message";
import tryit from "~/lib/try-it";
import { IngredientModel } from "~/data-access/models/ingredient-model.server";
import { IngredientPriceModel } from "~/data-access/models/ingredient-price-model.server";
import { ProductInfoModel } from "~/data-access/models/product-info-model.server";
import { ProductModel } from "~/data-access/models/product-model.server";

export async function loader() {

    const [errProducts, products] = await tryit(ProductModel.findAll())
    if (errProducts) {
        return serverError({ message: errProducts.message })
    }

    const [errProductsInfo, productsInfo] = await tryit(ProductInfoModel.findAll())
    if (errProductsInfo) {
        return serverError({ message: errProductsInfo.message })
    }

    const [errProductsCompositions, productsCompositions] = await tryit(ProductCompositionModel.findAll())
    if (errProductsCompositions) {
        return serverError({ message: errProductsCompositions.message })
    }

    const [errIngredients, ingredients] = await tryit(IngredientModel.findAll())
    if (errIngredients) {
        return serverError({ message: errIngredients.message })
    }

    // get all ingredients prices that are default
    const [errIngredientsPrices, ingredientsPrices] = await tryit(IngredientPriceModel.findWhere("defaultPrice", "==", true))
    if (errIngredientsPrices) {
        return serverError({ message: errIngredientsPrices.message })
    }

    // all the elemnts that are ingredients and products part of a composition
    const compositionsElements: CompositionElement[] = products
        .filter(p => productsInfo.find(pi => pi.productId === p.id && pi.isAlsoAnIngredient === true))
        .map(p => {
            return {
                id: p.id,
                name: p.name,
                type: "product",
                unit: "un",
                unitPrice: productsCompositions.filter(pc => pc.productId === p.id).reduce((acc, curr) => {
                    return acc + (ingredientsPrices.find(ip => ip.ingredientId === curr.elementId)?.unitPrice || 0)
                }, 0)

            }
        }).concat(ingredients.map(i => {
            return {
                id: i.id,
                name: i.name,
                type: "ingredient",
                unit: ingredientsPrices.find(ip => ip.ingredientId === i.id)?.unit || "un",
                unitPrice: ingredientsPrices.find(ip => ip.ingredientId === i.id)?.unitPrice || 0
            }
        }))

    return json({
        products,
        productsInfo,
        productsCompositions,
        compositionsElements,
        ingredients
    })
}

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "composition-add-element") {

        const [err, data] = await tryit(ProductCompositionModel.add({
            productId: values.productId,
            elementId: values.elementId,
            elementType: values.elementType,
            quantity: values.quantity,
            unit: values.unit,
            cost: values.cost
        }))

        if (err) {
            return badRequest({ action: "composition-add-element", message: errorMessage(err) })
        }

        return ok({ message: "Elemento adicionado com sucesso" })
    }

    if (_action === "composition-delete-element") {

        const [err, data] = await tryit(ProductCompositionModel.delete(values.productCompositionId as string))

        if (err) {
            return badRequest({ action: "composition-delete-element", message: errorMessage(err) })
        }

        return ok({ message: "Elemento removido com sucesso" })

    }

    return null
}


export default function SingleProductComposition() {
    let [searchParams, setSearchParams] = useSearchParams();
    const productId = searchParams.get("id") as string

    const loaderData = useLoaderData<typeof loader>()
    // all products compositions
    const productsCompositions: ProductComposition[] = loaderData.productsCompositions
    // the composition of the current product
    const productComposition: ProductComposition[] = productsCompositions.filter(p => p.productId === productId)


    return (
        <ul className="md:p-4">
            {productComposition.length > 0 && (
                productComposition.map(element => {

                    if (element.productId === undefined) return null

                    return (
                        <li key={element.id || Math.random().toString(32).slice(2)}>
                            <CompositionElementForm
                                productCompositionId={element?.id}
                                productId={productId}
                                elementId={element?.elementId}
                                elementType={element?.elementType}
                                unit={element?.unit}
                                quantity={element?.quantity}
                                cost={element?.cost}
                            />
                        </li>
                    )
                }))
            }
            <li key={Math.random().toString(32).slice(2)}>
                <CompositionElementForm
                    productCompositionId={undefined}
                    productId={productId}
                    elementId={undefined}
                    elementType={undefined}
                    unit={undefined}
                    quantity={undefined}
                    cost={0}
                />
            </li>
        </ul>
    )
}


interface CompositionElementFormProps {
    productCompositionId?: string
    productId: string
    elementId?: string
    elementType?: string
    unit?: string
    quantity?: number
    cost?: number
}


function CompositionElementForm({ productCompositionId, productId, elementId, elementType, unit, quantity, cost }: CompositionElementFormProps) {
    const navigation = useNavigation();
    const loaderData = useLoaderData<typeof loader>()

    // all products compositions, remove the element that also is the current product (eg. Massa cannot be a composition of Massa)
    const elements: CompositionElement[] = loaderData.compositionsElements.filter(e => e.id !== productId)

    const formActionSubmission = productCompositionId ? "composition-update-element" : "composition-add-element"

    const isDisabledDeleteSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"
    const isDisabledSaveSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"

    // this state is used to update the elementType when the elementId is changed
    const [elementIdSelected, setElementIdSelected] = useState(elementId)
    const [quantityValue, setQuantityValue] = useState(quantity)

    const elementSelected: CompositionElement = elements.find(e => e.id === elementIdSelected)

    console.log(elementSelected)

    return (

        <Form method="post" className="mb-2">
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center md:flex md:flex-row-reverse w-full md:items-start">

                <div className="flex flex-col gap-2 md:flex-row-reverse h-[120px] md:h-auto">
                    <Button type="submit" name="_action" value={formActionSubmission} disabled={isDisabledSaveSubmissionButton} size="sm" ><Save size={16} /></Button>
                    <Button type="submit" variant="destructive" name="_action" value={"composition-delete-element"} disabled={isDisabledDeleteSubmissionButton} size="sm"><Trash2 size={16} /></Button>
                </div>
                <div className="mb-4 w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col w-full md:flex-row gap-2">
                            <Input type="hidden" name="productCompositionId" value={productCompositionId} />
                            <Input type="hidden" name="productId" value={productId} />
                            <Input type="hidden" name="elementType" defaultValue={elementType || elementSelected?.type} />
                            <Input type="text" name="elementType" value={elementSelected?.unitPrice || 0} readOnly />
                            <Fieldset>
                                <Select name="elementId" defaultValue={elementId} required onValueChange={setElementIdSelected}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Elemento da composição" className="text-xs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {elements.map(e => (
                                                <SelectItem key={e.id} value={e.id} className={`${e.type === "product" && "font-semibold"}`}>
                                                    {e.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Fieldset>

                            <div className="flex gap-2">
                                {/* <Fieldset >
                                    <Select name="unit" defaultValue={unit} required >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup >
                                                <SelectItem value="gr">GR</SelectItem>
                                                <SelectItem value="un">UN</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Fieldset> */}
                                <Fieldset>
                                    <Input type="text" id="element-unit" required placeholder="Unidade" name="unit" className="md:w-[50px] outline-none border-none" defaultValue={uppercase(unit || elementSelected?.unit)} readOnly />
                                </Fieldset>
                                <Fieldset>
                                    <Input type="number" id="element-quantity" required placeholder="Quantitade" name="quantity" className="md:w-[100px]" defaultValue={quantity} onChange={(e) => {
                                        setQuantityValue(Number(e.target.value))
                                    }} />
                                </Fieldset>
                                <Fieldset>
                                    <Input type="text" id="element-cost" name="cost" className="md:w-[50px] outline-none border-none" value={cost || (elementSelected?.unitPrice || 0) * (quantityValue || 0)} readOnly />
                                </Fieldset>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Form>
    )
}