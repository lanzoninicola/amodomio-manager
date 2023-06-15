import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import Fieldset from "~/components/ui/fieldset";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { jsonParse } from "~/utils/json-helper";
import { ok } from "~/utils/http-response.server";
import type { PizzaSizeVariation } from "~/domain/pizza/pizza.entity.server";
import { urlAt } from "~/utils/url";
import { Separator } from "~/components/ui/separator";
import type { SizeSelectionOutletContext } from "./admin.catalogs.builder.$catalogId.products";
import { StepForward } from "lucide-react";
import { Button } from "~/components/ui/button";

export async function loader({ request }: ActionArgs) {
    const sizeIdParam = urlAt(request.url, -1)
    return ok({ sizeIdParam })
}

export async function action({ request }: ActionArgs) {
    const catalogId = urlAt(request.url, -3)
    const productId = urlAt(request.url, -1)

    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "catalog-create-size-selected") {
        const sizeId = values.sizeId as string
        return redirect(`/admin/catalogs/builder/${catalogId}/products/${productId}/sizes/${sizeId}`)
    }

    return null
}


export default function SizeSelection() {
    const context = useOutletContext<SizeSelectionOutletContext>()
    const sizes = context.sizes

    const loaderData = useLoaderData<typeof loader>()
    const sizeIdParam = loaderData.payload.sizeIdParam

    return (
        <>
            <Form method="post" className="mb-4">
                <div className="flex justify-between">
                    <Fieldset>
                        <Select name="sizeId" required defaultValue={sizeIdParam || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecionar..." />
                            </SelectTrigger>
                            <SelectContent  >
                                <SelectGroup >
                                    {sizes.map((s) => {
                                        return <SelectItem key={s.id} value={s.id ?? ""}>{s.name}</SelectItem>
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Fieldset>
                    <Button type="submit" name="_action" value="catalog-create-size-selected" className="w-[150px] gap-2">
                        <StepForward size={16} />
                        <span>Próximo</span>
                    </Button>
                </div>
            </Form>
            <Separator className="mb-8" />
            <Outlet />
        </>
    )
}
