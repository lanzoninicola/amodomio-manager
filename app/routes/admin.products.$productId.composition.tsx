import { Form, Link, useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { ProductCompositionWithAssociations, ProductWithAssociations } from "~/domain/product/product.entity";
import { ProductEntity } from "~/domain/product/product.entity";
import type { ProductOutletContext } from "./admin.products.$productId";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { Trash2, Edit, PlusSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { TableRow, TableTitles, Table } from "~/components/primitives/table-list";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";
import randomReactKey from "~/utils/random-react-key";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import toFixedNumber from "~/utils/to-fixed-number";
import type { ComponentType, ProductComposition } from "~/domain/product/product-composition.model.server";
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found";
import type { IngredientEntity } from "~/domain/ingredient/ingredient.entity";
import { ComponentSelector } from "./admin.resources.component-selector";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const productEntity = new ProductEntity()

    if (_action === "composition-add-component") {
        const [err, data] = await tryit(productEntity.addComponentToComposition({
            productId: values.productId as string,
            componentId: values.componentId as string,
            componentType: values.componentType as ComponentType,
        }))

        if (err) {
            return badRequest({ action: "composition-add-component", message: errorMessage(err) })
        }

        return ok({ message: "Elemento adicionado com sucesso" })
    }

    if (_action === "composition-delete-component") {

        const [err, data] = await tryit(productEntity.removeComponentFromComposition(values.id as string))

        if (err) {
            return badRequest({ action: "composition-delete-component", message: errorMessage(err) })
        }

        return ok({ message: "Elemento removido com sucesso" })

    }

    return null
}

export default function SingleProductComposition() {
    const context = useOutletContext<ProductOutletContext>()
    const product = context.product as ProductWithAssociations

    return (
        <div className="flex flex-col gap-8 h-full">
            {/* <ProductCompositionEdit /> */}
            <ComponentSelector productId={product.id} />
            <ProductComponentList />

        </div>
    )
}


// function ProductCompositionEdit() {
//     const context = useOutletContext<ProductOutletContext>()
//     const product = context.product as ProductWithAssociations
//     const productComposition = product.composition || []

//     const loaderData = useLoaderData<{ elements: (IngredientEntity | ProductEntity)[] }>()
//     const elements = loaderData.elements




//     const [searchParams, setSearchParams] = useSearchParams()
//     const productCompositionElementId = searchParams.get("productCompositionElementId")
//     const component = productComposition.find(el => el.id === productCompositionElementId)

//     const formActionSubmission = component?.id ? "composition-update-component" : "composition-add-component"

//     let formTitle
//     let submitButtonText
//     let submitButtonLoadingText

//     if (formActionSubmission === "composition-add-component") {
//         submitButtonText = "Salvar"
//         submitButtonLoadingText = "Salvando..."
//         formTitle = "Novo preço"
//     }

//     if (formActionSubmission === "composition-update-component") {
//         submitButtonText = "Atualizar"
//         submitButtonLoadingText = "Atualizando..."
//         formTitle = `Atualizar preço com ID: ${component?.id}`
//     }

//     const derivedUnitPrice = (component?.price || 0) / (component?.quantity || 1)

//     return (
//         <div className="md:p-8 md:border-2 rounded-lg border-muted">
//             <div className="flex flex-col gap-4">
//                 <h3 className="font-semibold">{formTitle}</h3>
//                 <Form method="post" >

//                     <div className="grid md:grid-cols-2 grid-cols-1 md:grid-rows-1 grid-rows-2 items-center md:gap-4">
//                         <div>
//                             <Input type="hidden" name="id" defaultValue={component?.id} />
//                             <Input type="hidden" name="productId" defaultValue={product.id} />
//                             <Fieldset>
//                                 <Label htmlFor="supplierId">Forneçedor</Label>
//                                 <Select name="supplierId" defaultValue={component?.supplierId} required >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Forneçedor" className="text-xs" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectGroup>
//                                             {suppliers.map(supplier => (
//                                                 supplier.id && <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
//                                             ))}
//                                         </SelectGroup>
//                                     </SelectContent>
//                                 </Select>
//                             </Fieldset>
//                         </div>

//                         <div className="flex md:flex-row gap-2">
//                             <Fieldset >
//                                 <Label htmlFor="unit">Unidade</Label>
//                                 <div className="max-w-[100px]">
//                                     <Select name="unit" defaultValue={component?.unit || "gr"} required>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Unidade" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectGroup >
//                                                 <SelectItem value="gr">GR</SelectItem>
//                                                 <SelectItem value="un">UN</SelectItem>
//                                             </SelectGroup>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                             </Fieldset>
//                             <Fieldset >
//                                 <Label htmlFor="quantity">Quantitade</Label>
//                                 <Input id="quantity" name="quantity" defaultValue={component?.quantity || 1} className="max-w-[100px]" autoComplete="off" required />
//                             </Fieldset>
//                             <Fieldset >
//                                 <Label htmlFor="unit-price">Preço unitário</Label>
//                                 <Input id="unit-price" name="unitPrice" readOnly defaultValue={component?.unitPrice || derivedUnitPrice}
//                                     className="max-w-[100px] border-none w-full text-right text-muted-foreground" tabIndex={-1} autoComplete="off" />
//                             </Fieldset>
//                             <Fieldset >
//                                 <Label htmlFor="price">Preço</Label>
//                                 <Input id="price" name="price" defaultValue={component?.price || 1} className="max-w-[100px]" autoComplete="off" />
//                             </Fieldset>
//                         </div>

//                     </div>
//                     <Fieldset >
//                         <div className="flex gap-16 items-center">
//                             <Label htmlFor="default-price">Preço padrão</Label>
//                             <Switch id="default-price" name="defaultPrice" defaultChecked={component?.defaultPrice} />
//                         </div>
//                     </Fieldset>
//                     <div className="w-full flex gap-4 justify-end">
//                         <Link to={`/admin/products/${product.id}/prices`}>
//                             <Button type="button" variant={"outline"} size={"lg"} className="flex gap-4">
//                                 <PlusSquare size={16} />
//                                 Novo preço
//                             </Button>
//                         </Link>
//                         <SubmitButton actionName={formActionSubmission} size={"lg"} className="w-full md:max-w-[150px] gap-2"
//                             idleText={submitButtonText}
//                             loadingText={submitButtonLoadingText}
//                         />
//                     </div>


//                 </Form>
//             </div>
//         </div>

//     )

// }





function ProductComponentList() {

    const context = useOutletContext<ProductOutletContext>()
    const productComposition = context.composition as ProductCompositionWithAssociations[] || []

    const formSubmissionState = useFormSubmissionnState()

    if (productComposition.length === 0) {
        return <NoRecordsFound text="Nenhum componente adicionado" />
    }

    return (
        <>
            <Table>
                <TableTitles
                    clazzName="grid-cols-7"
                    titles={[
                        "Ações",
                        "Nome",
                        "Unidade",
                        "Quantidade",
                        "Custo Unitário Componente",
                        "Custo Unitário",
                        "Custo Total"

                    ]}
                />

                {productComposition.length > 0 && (
                    productComposition.map((component) => {
                        return (
                            <Form method="post" key={component.id || randomReactKey()}>
                                <TableRow
                                    row={component}
                                    showDateColumns={false}
                                    clazzName="grid-cols-7"
                                    isProcessing={formSubmissionState === "inProgress"}
                                >
                                    <div className="flex gap-2">
                                        <Button variant="destructive" type="submit" name="_action" value="composition-delete-component" size={"sm"} className="w-[40px]">
                                            <Trash2 size={16} />
                                        </Button>
                                        <Link to={`?componentId=${component.id}`}>
                                            <Button type="button" size={"sm"} className="w-[40px]">
                                                <Edit size={16} />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div>
                                        <Input type="hidden" name="id" value={component.id} />
                                        <Input type="hidden" name="productId" value={component.productId} />
                                        <Input type="hidden" name="componentId" value={component.componentId} />
                                        <Input type="hidden" name="componentType" value={component.componentType} />
                                        <Input name="componentName" readOnly defaultValue={component.componentType === "ingredient" ? component.ingredient?.name : component.product?.name} className="border-none  w-full" />
                                    </div>
                                    <Input name="unit" readOnly defaultValue={component.unit} className="border-none  w-full" />
                                    <Input name="quantity" readOnly defaultValue={component.quantity} className="border-none  w-full" />
                                    <Input name="componentUnitCost" readOnly defaultValue={component.unitCost} className="border-none  w-full" />
                                    <Input name="unitCost" readOnly defaultValue={component.unitCost} className="border-none  w-full" />
                                    <Input name="costAmount" readOnly defaultValue={component.costAmount} className="border-none  w-full" />

                                </TableRow>
                            </Form >
                        )
                    })
                )}
            </Table>
        </>
    )

}

