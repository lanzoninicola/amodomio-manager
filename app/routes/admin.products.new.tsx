import { type ActionArgs } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ProductModel } from "~/data-access/models/product-model.server";
import { badRequest, ok } from "~/lib/api-response";
import errorMessage from "~/lib/error-message";
import tryit from "~/lib/try-it";

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

    return null
}


export default function ProductsIndex() {
    const navigation = useNavigation();

    return (
        <Container>
            <Card>
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
                            {/* <Button type="button" variant={"outline"} className="border-2 border-black hover:border-[inherit]" disabled={navigation.state === "submitting" || navigation.state === "loading"}
                                onClick={() => setSearchParams(new URLSearchParams())}>
                                Fechar
                            </Button> */}
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </Container>
    )
}