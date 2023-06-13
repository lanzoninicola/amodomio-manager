import { Form, Link, useOutletContext } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { type ActionArgs } from "@remix-run/node";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";
import type { ProductCompositionWithAssociations, ProductWithAssociations } from "~/domain/product/product.entity";
import { ProductEntity } from "~/domain/product/product.entity";
import type { ProductComponent, ProductOutletContext } from "./admin.products.$productId";
import { Trash2, Edit, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { TableRow, TableTitles, Table } from "~/components/primitives/table-list";
import useFormSubmissionnState from "~/hooks/useFormSubmissionState";
import randomReactKey from "~/utils/random-react-key";
import type { ComponentType } from "~/domain/product/product-composition.model.server";
import NoRecordsFound from "~/components/primitives/no-records-found/no-records-found";
import { ComponentSelector } from "./admin.resources.component-selector";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";


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
            <ComponentSelector productId={product.id} />
            <ProductComponentList />
        </div>
    )
}



function ProductComponentList() {

    const context = useOutletContext<ProductOutletContext>()
    const productComposition = context.composition as ProductComponent[]

    const formSubmissionState = useFormSubmissionnState()

    if (productComposition.length === 0) {
        return <NoRecordsFound text="Nenhum componente adicionado" />
    }

    return (

        <Table>
            <TableTitles
                clazzName="grid-cols-4"
                titles={[
                    "Nome",
                    "Unidade",
                    "Quantidade",
                    "Ações"
                ]}
            />

            {productComposition.length > 0 && (
                productComposition.map((component) => {
                    return (
                        <Form method="post" key={component.id || randomReactKey()}>
                            <TableRow
                                row={component}
                                showDateColumns={false}
                                clazzName="grid-cols-4"
                                isProcessing={formSubmissionState === "inProgress"}
                            >

                                <div>
                                    <Input type="hidden" name="id" value={component.id} />
                                    <Input type="hidden" name="productId" value={component.productId} />
                                    <Input type="hidden" name="componentId" value={component.componentId} />
                                    <Input type="hidden" name="componentType" value={component.componentType} />
                                    <Input name="componentName" readOnly defaultValue={component.name} className="border-none  w-full" />
                                </div>
                                <Select name="unit" defaultValue={component.unit} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup >
                                            <SelectItem value="gr">GR</SelectItem>
                                            <SelectItem value="un">UN</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Input name="quantity" defaultValue={component.quantity} className="w-full" />
                                <div className="flex gap-2">
                                    <Button type="submit" name="_action" value="composition-update-component">
                                        <Save size={16} />
                                    </Button>
                                    <Button variant="destructive" type="submit" name="_action" value="composition-delete-component">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </TableRow>
                        </Form >
                    )
                })
            )}
        </Table>

    )

}

