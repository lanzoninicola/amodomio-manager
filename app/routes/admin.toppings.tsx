import { Link, Outlet } from "@remix-run/react";
import { Plus } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";



export default function IngredientsOutlet() {


    return (
        <Container>
            <div className="flex justify-between items-center mb-8 md:mb-4">
                <h1 className="text-2xl font-bold">
                    Sabor
                </h1>
                <Link to={`/admin/toppings/new`}>
                    <Button type="button" className="flex gap-2">
                        <Plus size={16} />
                        Novo Sabor
                    </Button>
                </Link>
            </div>
            <Outlet />
        </Container>
    )
}