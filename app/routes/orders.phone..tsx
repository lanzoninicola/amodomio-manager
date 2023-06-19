import { type ActionArgs, redirect } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Input } from "~/components/ui/input";

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    const cartId = values["cartId"];
    const phoneNumber = values["phone"];

    if (_action === "orders-pizza-set-phone-number") {

        // save the phone number in the db for the order


        return redirect(`/orders/address?cartId=${cartId}&phone=${phoneNumber}`)
    }


    return null
}


export default function OrdersPhoneNumber() {

    const [searchParams, setSearchParams] = useSearchParams();
    const cartId = searchParams.get("cartId");

    return (
        <Container>
            <h1>orders.phone.tsx</h1>


            <Form method="post">
                <div className="flex flex-col">
                    <Input type="hidden" name="cartId" value={cartId ?? ""} />
                    <Input type="tel" name="phone" />
                </div>
                <SubmitButton actionName="orders-pizza-set-phone-number" idleText="Escolha sabores" loadingText="Escolha sabores" />
            </Form>
        </Container>
    )
}