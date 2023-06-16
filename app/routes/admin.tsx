import { NavLink, Outlet } from "@remix-run/react";

import AdminHeader from "~/components/layout/headers/admin-header/admin-header";
import useCurrentUrl from "~/hooks/use-current-url";



export default function AdminOutlet() {
    const currentUrl = useCurrentUrl()

    return (
        <>
            <AdminHeader />
            <Outlet />
        </>
    )
}