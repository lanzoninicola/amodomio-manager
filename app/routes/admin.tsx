import { type LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { NavMenuCollapsible } from "~/components/primitives/menu-collapsible/nav-menu-collapsible";

export const links: LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
    },
    {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap",
        rel: "stylesheet",
    },
];


export default function AdminOutlet() {

    return (

        <div className="flex flex-col">
            <div className="fixed h-auto w-full bg-muted z-50">
                <NavMenuCollapsible navItems={
                    [
                        { label: "Gerençiar cardápio", to: "/admin" },
                        { label: "Categorias", to: "/admin/categorias" },
                        { label: "Opções", to: "/admin/options" },
                        { label: "Voltar para o cardápio", to: "/cardapio" }
                    ]
                } />
            </div>
            <Outlet />
        </div>
    )
}

