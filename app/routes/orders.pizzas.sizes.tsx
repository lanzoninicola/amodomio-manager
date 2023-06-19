import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import SubmitButton from "~/components/primitives/submit-button/submit-button";
import { Button } from "~/components/ui/button";



export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "orders-pizza-size-toppings-amount-selected") {


        return redirect("/orders/pizzas?size=md&toppingsAmount=2")
    }


    return null
}


export default function OrdersSize() {
    return (
        <div>
            <h1>orders.pizzas.sizes.tsx</h1>

            <Form method="post">
                <div className="flex flex-col">
                    <select name="size" id="">tamanho</select>
                    <select name="toppings-amount" id="">sabores</select>
                </div>
                <SubmitButton actionName="orders-pizza-size-toppings-amount-selected">Escolha sabores</SubmitButton>
            </Form>

        </div>
    )
}