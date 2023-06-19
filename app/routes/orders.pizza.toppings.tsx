import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";




export default function OrdersPizzaTopping() {
    return (
        <div>

            <ul>
                <li>pizza 1</li>
                <li>pizza 2</li>
                <li>pizza 3</li>
                <li>pizza 4</li>
            </ul>
            <Link to="/orders/pizzas">
                <Button>Escolha sabores</Button>
            </Link>
        </div>
    )
}