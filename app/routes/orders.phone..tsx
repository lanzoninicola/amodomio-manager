import { type ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Input } from "~/components/ui/input";

export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "orders-pizza-add-phone-number") {


        return redirect("/orders/address?phone=123456789")
    }


    return null
}


export default function OrdersPhoneNumber() {
    return (
        <div>
            <h1>orders.phone.tsx</h1>


            <Form method="post">
                <div className="flex flex-col">
                    <Input type="tel" name="phone-number" />
                </div>
                <SubmitButton actionName="orders-pizza-add-phone-number">Escolha sabores</SubmitButton>
            </Form>
        </div>
    )
}