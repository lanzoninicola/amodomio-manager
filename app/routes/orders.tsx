import { Outlet } from "@remix-run/react";



export default function Orders() {
    return (
        <div>
            <div>this is the header</div>
            <Outlet />
        </div>
    )
}