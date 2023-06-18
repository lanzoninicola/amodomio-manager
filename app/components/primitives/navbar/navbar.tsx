import { Menu, X } from "lucide-react";
import NavbarItem, { type NavbarItemProps } from "./navbar-item/navabar-item";
import { useState } from "react";

interface NavbarProps {
    links: NavbarItemProps[]
}

export default function Navbar({ links }: NavbarProps) {
    const [navbarOpen, setNavbarOpen] = useState(false)

    return (
        <>
            <input type="checkbox" id="navbar-toggle" className="peer hidden outline-0" onChange={() => setNavbarOpen(!navbarOpen)} />
            <div className="hidden peer-checked:block md:block">
                <div className="absolute z-50 top-[100%] left-0 h-[75vh] w-[95vw] md:w-[inherit] md:h-[inherit] bg-white flex justify-center flex-col md:flex-row md:bg-none md:relative">
                    {links.map((link) => (
                        <NavbarItem key={link.href} {...link} />
                    ))}
                </div>
            </div>
            <label htmlFor="navbar-toggle" className="relative md:hidden">
                {navbarOpen ? <X size={28} /> : <Menu size={28} />}
            </label>
        </>
    )
}