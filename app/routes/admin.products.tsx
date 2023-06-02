import { Form, Link, useActionData, useLoaderData, useLocation, useMatches, useNavigate, useNavigation, useResolvedPath, useSearchParams } from "@remix-run/react";
import { MoreHorizontal, PinOff, Plus, Save, Trash2, X } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { AlertError } from "~/components/layout/alerts/alerts";
import { json, type ActionArgs } from "@remix-run/node";
import tryit from "~/lib/try-it";
import type { Product } from "~/data-access/models/product-model.server";
import { ProductModel } from "~/data-access/models/product-model.server";
import { badRequest, ok, serverError } from "~/lib/api-response";
import type { ProductComposition } from "~/data-access/models/product-composition-model.server";
import { ProductCompositionModel } from "~/data-access/models/product-composition-model.server";
import { Separator } from "~/components/ui/separator";
import errorMessage from "~/lib/error-message";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import type { ProductInfo } from "~/data-access/models/product-info-model.server";
import { ProductInfoModel } from "~/data-access/models/product-info-model.server";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { IngredientModel } from "~/data-access/models/ingredient-model.server";
import { useState } from "react";
import { IngredientPriceModel } from "~/data-access/models/ingredient-price-model.server";
import uppercase from "~/utils/to-uppercase";

// all the elemnts that are ingredients or products, part of a composition
interface CompositionElement {
    id: string | undefined
    name: string
    type: string
    unit: string
    unitPrice: number
}

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

    if (_action === "product-create") {

        const [err, data] = await tryit(ProductModel.add({ name: values.name }))

        if (err) {
            return badRequest({ action: "product-create", message: errorMessage(err) })
        }

        return ok({ ...data, message: "Ingrediente criado com sucesso" })
    }

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

export default function Index() {
    const navigation = useNavigation();
    // navigation.state; // "idle" | "submitting" | "loading"
    const responseData = useActionData<typeof action>();

    let [searchParams, setSearchParams] = useSearchParams();
    const productAction = searchParams.get("action")

    return (
        <Container>
            <div className="flex flex-col p-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">
                        Produtos
                    </h1>
                    <Link to={`?action=new`}>
                        <Button type="button" className="flex gap-2">
                            <Plus size={16} />
                            Novo Produto
                        </Button>
                    </Link>
                </div>
                {productAction === "new" && <Card>
                    <CardHeader>
                        <CardTitle>Novo Produto</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <Form method="post" >
                            <Fieldset>
                                <Label htmlFor="products-name">Nome</Label>
                                <Input type="string" id="product-name" placeholder="Nome producte" name="name" required />
                            </Fieldset>
                            <div className="flex gap-2">
                                <Button type="submit" name="_action" value="product-create" disabled={navigation.state === "submitting" || navigation.state === "loading"}>
                                    Salvar
                                </Button>
                                <Button type="button" variant={"outline"} className="border-2 border-black hover:border-[inherit]" disabled={navigation.state === "submitting" || navigation.state === "loading"}
                                    onClick={() => setSearchParams(new URLSearchParams())}>
                                    Fechar
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>}

            </div>

            <Card className="mx-4 md:mx-8">
                <CardHeader>
                    <CardTitle>Lista produtos</CardTitle>
                    <CardDescription>
                        Lista de produtos
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <ProductList />
                </CardContent>
            </Card>

            {responseData && responseData?.status >= 400 && (
                <AlertError title={responseData?.action} message={responseData?.message} />)}
        </Container>
    )
}


function ProductList() {
    const loaderData = useLoaderData<typeof loader>()


    if (!loaderData?.products || loaderData.products.length === 0) {
        return (
            <div className="grid place-items-center">
                <p className="text-xl font-muted-foreground">Nenhum produto encontrado</p>
            </div>
        )
    }

    return (
        <ul>
            {loaderData.products.map(product => {
                return (
                    <li key={product.id} className="mb-4">
                        <ProductItem product={product} />

                    </li>
                )
            })}
        </ul>
    )
}

function ProductItem({ product }: { product: Product }) {
    let [searchParams, _] = useSearchParams();
    const activeProductId = searchParams.get("id")
    const activeTab = searchParams.get("tab")

    const activeTabStyle = "bg-primary text-white rounded-md py-1"

    return (
        <>
            <Form method="post" className="grid grid-cols-2 justify-between items-center mb-4" >
                <div>
                    <Input type="hidden" name="id" value={product.id} />
                    <Input name="id" defaultValue={product.name} className="border-none w-full" />

                </div>
                <div className="flex justify-end gap-2 md:gap-4 mb-2">
                    <Button variant="destructive" size="sm" type="submit" name="_action" value="product-disable">
                        <PinOff size={16} />
                    </Button>

                    <Link to={`?id=${product.id}&tab=info`}>
                        <Button type="button" size="sm">
                            {activeProductId === product.id ? <X size={16} /> : <MoreHorizontal size={16} />}
                        </Button>
                    </Link>
                </div>
            </Form>
            {activeProductId === product.id && (
                <>
                    <div className="grid grid-cols-2 grid-rows-2 md:grid-rows-1 md:grid-cols-3 h-20 md:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-8">
                        <Link to={`?id=${product.id}&tab=info`} className="w-full text-center">
                            <div className={`${activeTab === "info" && activeTabStyle} ${activeTab}`}>
                                <span>Informações</span>
                            </div>

                        </Link >
                        <Link to={`?id=${product.id}&tab=composition`} className="w-full text-center">
                            <div className={`${activeTab === "composition" && activeTabStyle} ${activeTab}`}>
                                <span>Composição</span>
                            </div>

                        </Link >
                        <Link to={`?id=${product.id}&tab=dashboard`} className="w-full text-center">
                            <div className={`${activeTab === "dashboard" && activeTabStyle}`}>
                                <span>Estatisticas</span>
                            </div>
                        </Link>
                    </div >
                    <div className="mb-8">
                        {activeTab === "info" && (<ProductInformation />)}
                        {activeTab === "composition" && (<ProductCompositionComponent />)}
                    </div>
                </>
            )}


            <Separator />
        </>
    )
}

function ProductInformation() {
    let [searchParams, _] = useSearchParams();
    const activeProductId = searchParams.get("id")
    const navigation = useNavigation()

    const loaderData = useLoaderData<typeof loader>()
    const productsInfo: ProductInfo[] = loaderData?.productsInfo
    const productInfo = productsInfo.find(p => p.productId === activeProductId)

    const formActionSubmission = productInfo?.id ? "product-info-update" : "product-info-create"

    return (
        <div className="p-4">
            <Form method="post" className="w-full">
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
            </Form>
        </div>
    )
}

function ProductCompositionComponent() {
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

