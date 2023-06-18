import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function OrdersPizzasIndex() {

    return (
        <div>
            <h1>orders.pizza._index.tsx</h1>
            <Link to="/orders/pizzas/sizes">
                <Button>Adiçionar pizza</Button>
            </Link>
        </div>
    )
}