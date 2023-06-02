import { NavLink, Outlet } from "@remix-run/react";
import useCurrentUrl from "~/components/hooks/use-current-url";



export default function AdminOutlet() {
    const currentUrl = useCurrentUrl()

    return (
        <>
            <header className="grid grid-cols-[.25fr_1fr_.25fr] items-center p-4 border-b-2 border-muted mb-8">
                <div>
                    <span>here the logo</span>
                </div>
                <div className="flex justify-center gap-6">
                    <NavLink to={`/admin/ingredients`}>
                        <div className="hover:rounded-lg hover:bg-muted px-6 py-2">
                            <span className="text-xl font-semibold">Ingredientes</span>
                        </div>
                    </NavLink>

                    <NavLink to={`/admin/products`}>
                        <div className="hover:rounded-lg hover:bg-muted px-6 py-2">
                            <span className="text-xl font-semibold">Produtos</span>
                        </div>
                    </NavLink>
                </div>
                <div>
                    <span>here the user avatar</span>
                </div>


            </header>
            <Outlet />
        </>
    )
}