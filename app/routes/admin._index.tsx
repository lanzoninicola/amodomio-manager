import type { LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";


export async function loader({ request }: LoaderArgs) {
    return null
}


export default function AdminPage() {
    return (
        <Container clazzName="flex flex-col gap-8">
            <div>
                <h2 className="scroll-m-20 text-2xl font-bold tracking-tight mb-8">Cárdapio</h2>
                <div className="flex flex-wrap gap-y-4 md:justify-evenly">
                    <Card className="w-full md:max-w-sm">
                        <CardHeader>
                            <CardTitle>Cárdapio</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <h4 className="text-sm text-muted-foreground">
                                O cardápio é o conjunto de catálogos de produtos que serão exibidos no site do cárdapio digital.
                            </h4>
                            <ul>
                                <LinkAdminMenu to="/admin/menu/new">Criar cárdapio</LinkAdminMenu>
                                <LinkAdminMenu to="/admin/menu">Listar cárdapio</LinkAdminMenu>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="w-full md:max-w-sm">
                        <CardHeader>
                            <CardTitle>Catálogos</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <h4 className="text-sm text-muted-foreground">
                                O catálogo é o conjunto da mesma familha de produtos que serão exibidos no site do cárdapio digital.
                            </h4>
                            <ul>
                                <LinkAdminMenu to="/admin/catalogs/new">Criar cátalogo</LinkAdminMenu>
                                <LinkAdminMenu to="/admin/catalogs">Listar cátalogos</LinkAdminMenu>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="w-full md:max-w-sm">
                        <CardHeader>
                            <CardTitle>Ingredientes</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <h4 className="text-sm text-muted-foreground">
                                Os ingredientes são os itens que compõem os produtos do catálogo.
                            </h4>
                            <ul>
                                <LinkAdminMenu to="/admin/ingredients/new">Criar ingredientes</LinkAdminMenu>
                                <LinkAdminMenu to="/admin/ingredients">Listar ingredientes</LinkAdminMenu>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="w-full md:max-w-sm">
                        <CardHeader>
                            <CardTitle>Sabores Pizza</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <h4 className="text-sm text-muted-foreground">
                                Os sabores de pizza são um grupo de ingredientes que iram exibidos como opções de sabores de pizza.
                            </h4>
                            <ul>
                                <LinkAdminMenu to="/admin/toppings/new">Criar sabor</LinkAdminMenu>
                                <LinkAdminMenu to="/admin/toppings">Listar sabores</LinkAdminMenu>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div>
                <h2 className="scroll-m-20 text-2xl font-bold tracking-tight">ERP</h2>
            </div>
        </Container>
    )
}

interface LinkAdminMenuProps {
    to: string;
    children: React.ReactNode;
}


function LinkAdminMenu({ to, children }: LinkAdminMenuProps) {
    return (
        <li className="text-lg p-3 md:p-0 rounded-md bg-muted md:text-sm font-semibold mb-2">
            <Link to={to}>
                {children}
            </Link>
        </li>
    )
}