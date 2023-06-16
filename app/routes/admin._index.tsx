import type { LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { MenuSquare } from "lucide-react";
import Container from "~/components/layout/container/container";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";


export async function loader({ request }: LoaderArgs) {
    return null
}


export default function AdminPage() {
    return (
        <Container clazzName="flex flex-col gap-8 md:p-16">
            <div>
                <h2 className="scroll-m-20 text-2xl font-bold tracking-tight mb-8">Cárdapio</h2>
                <div className="flex flex-wrap gap-y-4 lg:justify-evenly">
                    <Card className="w-full lg:max-w-sm">
                        <CardHeader>
                            <MenuTitle>Cárdapio</MenuTitle>
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
                    <Card className="w-full lg:max-w-sm">
                        <CardHeader>
                            <MenuTitle>Catálogos</MenuTitle>
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
                    <Card className="w-full lg:max-w-sm">
                        <CardHeader>
                            <MenuTitle>Ingredientes</MenuTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <h4 className="text-sm text-muted-foreground">
                                Os ingredientes são os itens que compõem os produtos do catálogo.
                            </h4>
                            <ul>
                                <LinkAdminMenu to="/admin/ingredients/new">Criar ingrediente</LinkAdminMenu>
                                <LinkAdminMenu to="/admin/ingredients">Listar ingredientes</LinkAdminMenu>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="w-full lg:max-w-sm">
                        <CardHeader>
                            <MenuTitle>Sabores Pizza</MenuTitle>
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
        <li>
            <Link to={to} className="w-full inline-block p-3 text-lg lg:p-0 rounded-md bg-muted lg:bg-transparent lg:text-sm font-semibold mb-2">
                {children}
            </Link>
        </li>
    )
}

function MenuTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-2">
            <MenuSquare size={32} />
            <CardTitle className="text-2xl">{children}</CardTitle>
        </div>
    )
}