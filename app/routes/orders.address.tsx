import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useSearchParams } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import Fieldset from "~/components/ui/fieldset";
import { Input } from "~/components/ui/input";


export async function loader({ request }: LoaderArgs) {


    // check the orders by phone number and get the addresses for the phone number

    return null
}

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const cartId = values["cartId"];
    const phoneNumber = values["phone"];
    const cep = values["cep"];

    if (_action === "orders-pizza-set-address") {
        // save the address in the db for the order
        return redirect(`/orders/pizzas?cartId=${cartId}&phone=${phoneNumber}&cep=${cep}`)
    }


    return null
}

export default function OrdersAddress() {
    const [searchParams, setSearchParams] = useSearchParams();
    const cartId = searchParams.get("cartId");
    const phoneNumber = searchParams.get("phone");

    // if the user comes back to this page, we want to prefill the cep
    const cep = searchParams.get("cep") ?? "";


    return (
        <Container>
            <h1>orders.phone.tsx</h1>


            <Form method="post">
                <Input type="hidden" name="cartId" value={cartId ?? ""} />
                <Input type="hidden" name="phone" value={phoneNumber ?? ""} />
                <Fieldset>
                    <Input type="text" name="cep" defaultValue={cep} />
                    <Link to="https://buscacepinter.correios.com.br/app/endereco/index.php">Não sei meu CEP</Link>
                </Fieldset>
                <Fieldset>
                    <Input type="text" name="street" />
                    <Input type="text" name="number" />
                    <Input type="text" name="complement" />
                    <Input type="text" name="neighborhood" />
                    <Input type="text" name="reference" />
                    <Input type="text" name="city" />
                    <Input type="text" name="state" />
                    <Input type="text" name="country" />

                </Fieldset>
                <SubmitButton actionName="orders-pizza-set-address" idleText="Escolha sabores" loadingText="Escolha sabores" />
            </Form>
        </Container>
    )
}