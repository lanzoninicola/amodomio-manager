import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import Fieldset from "~/components/ui/fieldset";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { CatalogBuilderOutletContext } from "./admin.catalogs.builder";
import { urlAt } from "~/utils/url";
import { Separator } from "~/components/ui/separator";
import { ok } from "~/utils/http-response.server";
import { Button } from "~/components/ui/button";
import { StepForward } from "lucide-react";

export async function loader({ request }: ActionArgs) {
    const productIdParam = urlAt(request.url, -1)
    return ok({ productIdParam })
}

export async function action({ request }: ActionArgs) {
    const catalogId = urlAt(request.url, -1)

    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "catalog-create-product-selected") {
        const productId = values.productId as string
        return redirect(`/admin/catalogs/builder/${catalogId}/products/${productId}`)
    }

    return null
}


export default function ProductSelection() {
    const context = useOutletContext<CatalogBuilderOutletContext>()
    const products = context.products

    // when selected the product //
    const loaderData = useLoaderData<typeof loader>()
    const productIdParam = loaderData.payload.productIdParam as string

    return (
        <div className="border-2 border-muted rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Etapa 1</p>
            <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
                Seleçionar Produto
            </h3>
            <Form method="post" className="mb-4">
                <div className="flex justify-between">
                    <Fieldset>
                        <Select name="productId" required defaultValue={productIdParam}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecionar..." />
                            </SelectTrigger>
                            <SelectContent  >
                                <SelectGroup >
                                    {products.map((p) => {
                                        return <SelectItem key={p.id} value={p.id ?? ""}>{p.name}</SelectItem>
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Fieldset>
                    <Button type="submit" name="_action" value="catalog-create-product-selected" className="w-[150px] gap-2">
                        <StepForward size={16} />
                        <span>Próximo</span>
                    </Button>
                </div>
            </Form>
            <Separator className="mb-8" />
            <Outlet />
        </div>
    )
}

