import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useSearchParams } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const cartId = values["cartId"];
    const phoneNumber = values["phone"];
    const cep = values["cep"];


    if (_action === "orders-pizza-create-order-item") {

        // create a record of the order item in the db
        // return the id of the order item

        const itemId = "123";

        return redirect(`/orders/pizzas/sizes?cartId=${cartId}&phone=${phoneNumber}&cep=${cep}&itemId=${itemId}}`)
    }


    return null
}


export default function OrdersPizzasIndex() {

    const [searchParams, setSearchParams] = useSearchParams();
    const cartId = searchParams.get("cartId");
    const phoneNumber = searchParams.get("phone");
    const cep = searchParams.get("cep") ?? "";

    return (
        <Container>
            <Form method="post">
                <Input type="hidden" name="cartId" value={cartId ?? ""} />
                <SubmitButton actionName="orders-pizza-create-order-item" idleText="Adicionar pizza" loadingText="Adicionar pizza" />
            </Form>
        </Container>
    )
}