import { User2 } from "lucide-react";
import Navbar from "~/components/primitives/navbar/navbar";


const navLinks = [
    { label: "Ingredientes", href: "/admin/ingredients" },
    { label: "Produtos", href: "/admin/products" },
    { label: "Forneçedores", href: "/admin/suppliers" },
]


export default function AdminHeader() {
    return (
        <header className="relative flex justify-end items-center w-full h-[85px] px-4 gap-4 md:gap-8 border-b-2 border-muted mb-4">
            <div className="absolute top-8 left-4 ">
                <span>here the logo</span>
            </div>

            <Navbar links={navLinks} />
            <User2 size={28} />


        </header>
    )
}

