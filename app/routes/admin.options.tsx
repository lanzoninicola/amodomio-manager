import type { LoaderArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { optionEntity } from "~/domain/option/option.entity.server";


export async function action({ request }: LoaderArgs) {

    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "option-item-create") {

        const name = values.name as string
        const value = values.value as string

        await optionEntity.create({ name, value })
    }

    return null
}

export default function OptionsIndex() {

    return (

        <Container>
            <div className="fixed top-[35px] left-0  w-full p-4 bg-muted z-10" >
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold text-xl">Opções</h1>
                </div>
            </div>
            <div className="mt-28">
                <Form method="post">
                    <Fieldset>
                        <Label htmlFor="waNumberForOrders">Numero WhatsApp para Pedidos</Label>
                        <Input type="hidden" name="name" value="waNumberForOrders" />
                        <Input type="text" name="value" id="waNumberForOrders" />
                    </Fieldset>

                    <SubmitButton actionName="option-item-create">Salvar</SubmitButton>
                </Form>

            </div>

        </Container>

    )

}