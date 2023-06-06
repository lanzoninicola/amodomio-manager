import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Trash2 } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { type Supplier, SupplierModel } from "~/domain/supplier/supplier.model.server";

export async function loader() {
    const suppliers = await SupplierModel.findAll()

    return json(suppliers)
}

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    try {
        if (_action === "create-supplier") {
            await SupplierModel.add({
                name: values.name,
                phoneNumber: values["phone-number"],
                email: values.email,
                contactName: values["contact-name"]
            })
            return json(values.name)
        }

        if (_action === "supplier-delete") {
            await SupplierModel.delete(values.id as string)
            return json({ success: true })
        }

    } catch (error) {
        return json({ error })
    }
}



export default function Index() {
    const loaderData: Supplier[] = useLoaderData<typeof loader>()

    return (
        <Container clazzName={"mb-8"}>
            <div className="flex flex-col p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Fornecedores
                </h1>
                <Form method="post">
                    <Fieldset>
                        <Label htmlFor="supplier-name">Nome</Label>
                        <Input type="string" id="supplier-name" placeholder="Nome" name="name" />
                    </Fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                        <Fieldset>
                            <Label htmlFor="supplier-phone-number">Numero de telefone</Label>
                            <Input type="tel" id="supplier-phone-number" placeholder="Numero de telefone" name="phone-number" />
                        </Fieldset>
                        <Fieldset>
                            <Label htmlFor="supplier-email">E-mail</Label>
                            <Input type="email" id="supplier-email" placeholder="E-mail" name="email" />
                        </Fieldset>
                    </div>
                    <Fieldset>
                        <Label htmlFor="supplier-contact-name">Nome de contato</Label>
                        <Input type="string" id="supplier-contact-name" placeholder="Nome de contato" name="contact-name" />
                    </Fieldset>
                    <Button type="submit" name="_action" value="create-supplier">Salvar</Button>
                </Form>

            </div>

            <Card className="mx-4 md:mx-8">
                <CardHeader>
                    <CardTitle>Lista fornecedores</CardTitle>
                    <CardDescription>
                        Lista de fornecedores cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {loaderData.length === 0 && (
                        <span>Nenhum fornecedor cadastrado</span>
                    )}
                    <IngredientList suppliers={loaderData} />
                </CardContent>
            </Card>

        </Container>
    )
}


function IngredientList({ suppliers }: { suppliers: Supplier[] }) {
    return (
        <ul>
            {suppliers.map(supplier => (
                <li key={supplier.id} className="mb-4">
                    <Form method="delete" className="grid grid-cols-2 justify-between mb-2" >
                        <div>
                            <Input type="hidden" name="id" value={supplier.id} />
                            <p className="font-bold mb-2 md:mb-4">{supplier.name}</p>
                            <div className="flex flex-col gap-2 md:gap-1">
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-sm text-muted-foreground">E-mail:</span>
                                    <span className="text-sm">{supplier.email}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-sm text-muted-foreground">Numero de telefone</span>
                                    <span className="text-sm">{supplier.phoneNumber}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-sm text-muted-foreground">Nome de contato</span>
                                    <span className="text-sm">{supplier.contactName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 md:gap-4 mb-2">
                            <Button variant="destructive" size="sm" type="submit" name="_action" value="supplier-delete">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </Form>
                    <Separator />
                </li>
            ))}
        </ul>
    )
}