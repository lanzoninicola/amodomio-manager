import { NavLink, Outlet } from "@remix-run/react";
import useCurrentUrl from "~/components/hooks/use-current-url";
import AdminHeader from "~/components/layout/headers/admin-header/admin-header";



export default function AdminOutlet() {
    const currentUrl = useCurrentUrl()

    return (
        <>
            <AdminHeader />
            <Outlet />
        </>
    )
}