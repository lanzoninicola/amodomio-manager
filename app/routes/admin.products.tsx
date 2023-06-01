import { Form, Link, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { Plus } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { AlertError } from "~/components/layout/alerts/alerts";
import { type ActionArgs } from "@remix-run/node";


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

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
                                <Button type="submit" name="_action" value="create-product" disabled={navigation.state === "submitting" || navigation.state === "loading"}>
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
                    <CardTitle>Lista productes</CardTitle>
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
    return <div>product list</div>
}