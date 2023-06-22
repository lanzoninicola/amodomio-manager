import { type LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

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

    return <Outlet />
}