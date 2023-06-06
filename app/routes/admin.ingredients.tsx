import { Link, Outlet } from "@remix-run/react";
import { Plus } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";



export default function IngredientsOutlet() {
    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Ingredientes
                </h1>
                <Link to={`?action=new`}>
                    <Button type="button" className="flex gap-2">
                        <Plus size={16} />
                        Novo Ingrediente
                    </Button>
                </Link>
            </div>
            <Outlet />
        </Container>
    )
}