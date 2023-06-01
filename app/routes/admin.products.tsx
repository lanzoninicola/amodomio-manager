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
import { ProductCompositionModel } from "~/data-access/models/product-composition-model.server";
import { Separator } from "~/components/ui/separator";
import errorMessage from "~/lib/error-message";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import useCurrentUrl from "~/components/hooks/use-current-url";
import type { ProductInfo } from "~/data-access/models/product-info-model.server";
import { ProductInfoModel } from "~/data-access/models/product-info-model.server";


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

    return json({
        products,
        productsInfo,
        productsCompositions
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
    if (!loaderData.products || loaderData.products.length === 0) {
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
                    <div className="grid grid-cols-3 h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-8">
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
                        {/* {activeTab === "composition" && (<ElementsList />)} */}
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
                    {/* <Fieldset>
                    <div className="flex justify-between">
                        <Label htmlFor="is-alternative-description-menu" className="text-sm">
                            Descrição diferente para o cardapio
                        </Label>
                        <Link to={`${currentUrl}&alternativeDescription=true`}>
                            <Switch id="is-alternative-description-menu" name="isAlternativeDescriptionOnMenu" defaultChecked={product?.isAlternativeDescriptionOnMenu} />
                        </Link>
                    </div>
                </Fieldset>
                {alternativeDescriptionEnabled === true && (
                    <Fieldset>
                        <Label htmlFor="alternative-description-menu">Descrição no cardapio</Label>
                        <Textarea id="alternative-description-menu" name="alternativeDescriptionOnMenu" placeholder="Descrição no cardapio" defaultValue={product?.description} />
                    </Fieldset>
                )} */}
                    <div>
                        <Fieldset>
                            <div className="flex justify-between">
                                <Label htmlFor="is-also-ingredient" className="text-sm">
                                    Tambem é um ingrediente
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
/**
function ElementsList() {
    let [searchParams, setSearchParams] = useSearchParams();
    const productId = searchParams.get("id") as string

    const loaderData = useLoaderData<typeof loader>()
    // all products compositions
    const productsCompositions = loaderData.productsCompositions

    const productComposition = productsCompositions.filter(pc => pc. === productId)

    return (
        <ul className="md:p-4">
            {ingredientPrices.length > 0 && (
                ingredientPrices.map(ingredientPrice => {

                    if (ingredientPrice.productId === undefined) return null

                    return (
                        <li key={ingredientPrice.id || Math.random().toString(32).slice(2)}>
                            <CompositionElementForm
                                productCompositionId={undefined}
                                productId={productId}
                                elementId={undefined}
                                elementType={undefined}
                                unit={undefined}
                                quantity={undefined}
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
}

function CompositionElementForm({ productCompositionId, productId, elementId, elementType, unit, quantity, price, isDefault }: CompositionElementFormProps) {
    const navigation = useNavigation();
    const loaderData = useLoaderData<typeof loader>()

    // all suppliers
    const suppliers = loaderData.suppliers

    const formActionSubmission = productCompositionId ? "composition-update-element" : "composition-add-element"

    const isDisabledDeleteSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"
    const isDisabledSaveSubmissionButton = navigation.state === "submitting" || navigation.state === "loading"

    return (

        <Form method="post" className="mb-2">
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center md:flex md:flex-row-reverse w-full md:items-start">

                <div className="flex flex-col gap-2 md:flex-row-reverse h-[120px] md:h-auto">
                    <Button type="submit" name="_action" value={formActionSubmission} disabled={isDisabledSaveSubmissionButton} size="sm" ><Save size={16} /></Button>
                    <Button type="submit" variant="destructive" name="_action" value={"ingredient-delete-price"} disabled={isDisabledDeleteSubmissionButton} size="sm"><Trash2 size={16} /></Button>
                </div>
                <div className="mb-4 w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col w-full md:flex-row gap-2">
                            <Input type="hidden" name="ingredientPriceId" value={ingredientPriceId} />
                            <Input type="hidden" name="ingredientId" value={ingredientId} />
                            <Fieldset>
                                <Select name="supplierId" defaultValue={supplierId} required >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Forneçedor" className="text-xs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {suppliers.map(supplier => (
                                                <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Fieldset>

                            <div className="flex gap-2">
                                <Fieldset >
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
                                </Fieldset>
                                <Fieldset>
                                    <Input type="number" id="ingredient-quantity" required placeholder="Quantitade" name="quantity" className="md:w-[100px]" defaultValue={quantity} />
                                </Fieldset>
                                <Fieldset>
                                    <Input type="number" id="ingredient-price" required placeholder="Preço" name="price" className="md:w-[100px]" defaultValue={price} />
                                </Fieldset>

                            </div>

                        </div>
                        <div className="flex justify-between">
                            <Label htmlFor="default-price-mode" className="text-sm">Esse é o preço preferençial</Label>
                            <Switch id="default-price" name="defaultPrice" defaultChecked={isDefault === true ? true : false} />
                        </div>
                    </div>
                </div>


            </div>
        </Form>
    )
}

 */