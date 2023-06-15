import { redirect, type ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { FormLabel } from "~/components/layout/form";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { sizeEntity } from "~/domain/size/size.entity.server";
import type { Size } from "~/domain/size/size.model.server";
import errorMessage from "~/utils/error-message";
import { badRequest } from "~/utils/http-response.server";
import toNumber from "~/utils/to-number";
import tryit from "~/utils/try-it";

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "size-create") {

        const size: Size = {
            name: values.name as string,
            slices: toNumber(values.slices),
            maxToppingsAmount: toNumber(values.maxToppingsAmount),
            factorSize: toNumber(values.factorSize),
            factorToppingsAmount: toNumber(values.factorSize),
        }

        const [err, data] = await tryit(sizeEntity.create(size))

        if (err) {
            return badRequest({ action: "size-create", message: errorMessage(err) })
        }

        return redirect(`/admin/sizes/${data.id}/info`)
    }

    return null
}


export default function SingleSizeNew() {

    return (
        <>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Novo Tamanho</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <Form method="post">
                        <div className="flex flex-col gap-4 mb-4">
                            <div>
                                <Fieldset>
                                    <Label htmlFor="size-name">Nome</Label>
                                    <Input type="string" id="size-name" placeholder="Nome tamanho" name="name" required />
                                </Fieldset>
                            </div>

                            <div className="flex gap-4">
                                <Fieldset>
                                    <FormLabel htmlFor="slices">Numero de fatias</FormLabel>
                                    <SizeInputNumber id="slices" name="slices" />
                                </Fieldset>

                                <Fieldset>
                                    <FormLabel htmlFor="maxToppingsAmount">Numero maximo de sabores</FormLabel>
                                    <SizeInputNumber id="maxToppingsAmount" name="maxToppingsAmount" />
                                </Fieldset>
                            </div>

                            <div className="flex gap-4">
                                <Fieldset>
                                    <FormLabel htmlFor="factorSize">Fator "x" relaçionado ao tamanho</FormLabel>
                                    <SizeInputNumber id="factorSize" name="factorSize" maxLength={4} />
                                </Fieldset>

                                <Fieldset>
                                    <FormLabel htmlFor="factorToppingsAmount">Fator "x" relaçionado ao numeros de sabores</FormLabel>
                                    <SizeInputNumber id="factorToppingsAmount" name="factorToppingsAmount" maxLength={4} />
                                </Fieldset>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <SubmitButton actionName="size-create" className="w-[150px] gap-2" />
                        </div>
                    </Form>

                </CardContent>


            </Card>
            <CalculationExplanation />
        </>
    )
}

function SizeInputNumber({ ...props }) {
    return <Input type="text" required className="max-w-[70px]" pattern="[0-9]" maxLength={2} autoComplete="off" {...props} />
}

function CalculationExplanation() {
    return (
        <div className="mb-8 p-4 bg-muted rounded-md">
            Para calcular a quantitade de ingredientes, é feito o seguinte calculo:
            <br />
            <br />
            <code>
                (quantitade de ingrediente base) * (fator do tamanho) * (fator do numero de sabores)
            </code>

            <br />
            <br />
            <div>
                <strong>Exemplo:</strong>
                <br />
                <br />
                <code>
                    (2000gr) * (1,5) * (1,5) = 4500gr
                </code>

                <br />
                <br />


                <strong>Explicação:</strong>
                <br />
                <br />
                <code>
                    2000gr = quantitade de ingrediente base para um tamanho "M"
                </code>
                <br />
                <code>
                    1,5 = fator do tamanho "G" (o tamanho "G" é 1,5x maior que o tamanho "M")
                </code>
                <br />
                <code>
                    1,5 = fator do numero de sabores (o tamanho "G" tem 1,5x mais sabores que o tamanho "M")
                </code>
            </div>


        </div>
    )
}