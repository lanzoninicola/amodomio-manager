import { Link, Outlet } from "@remix-run/react";
import { Plus } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";



export default function ProductsOutlet() {
    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Produtos
                </h1>
                <Link to={`/admin/products/new`}>
                    <Button type="button" className="flex gap-2">
                        <Plus size={16} />
                        Novo Produto
                    </Button>
                </Link>
            </div>
            <Outlet />

        </Container>
    )
}
