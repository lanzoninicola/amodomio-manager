import { redirect, type ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ProductEntity } from "~/domain/product/product.entity";
import type { ProductUnit } from "~/domain/product/product.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest, ok } from "~/utils/http-response.server";
import tryit from "~/utils/try-it";

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "product-create") {

        const productEntity = new ProductEntity()
        const [err, data] = await tryit(productEntity.create({
            name: values.name as string,
            unit: values.unit as ProductUnit,
            info: null
        }))

        if (err) {
            return badRequest({ action: "product-create", message: errorMessage(err) })
        }

        return redirect(`/admin/products/${data.id}/info`)
    }

    return null
}


export default function SingleProductNew() {

    return (
        <Container>
            <Card>
                <CardHeader>
                    <CardTitle>Novo Produto</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <Form method="post"  >
                        <div className="flex gap-2">
                            <Fieldset>
                                <Label htmlFor="product-name">Nome</Label>
                                <Input type="string" id="product-name" placeholder="Nome produto" name="name" required />
                            </Fieldset>
                            <Fieldset>

                                <div className="max-w-[150px]">
                                    <Label htmlFor="unit">Unidade</Label>
                                    <Select name="unit" required defaultValue="gr">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecionar..." />
                                        </SelectTrigger>
                                        <SelectContent id="unit"  >
                                            <SelectGroup >
                                                <SelectItem value="gr">GR</SelectItem>
                                                <SelectItem value="un">UN</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Fieldset>
                        </div>
                        <div className="flex gap-2">
                            <SubmitButton actionName="product-create" className="w-[150px] gap-2" />
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </Container>
    )
}