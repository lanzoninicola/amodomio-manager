import { Menu } from "lucide-react";
import NavbarItem, { type NavbarItemProps } from "./navbar-item/navabar-item";

interface NavbarProps {
    links: NavbarItemProps[]
}

export default function Navbar({ links }: NavbarProps) {
    return (
        <>
            <input type="checkbox" id="navbar-toggle" className="peer hidden outline-0" />
            <div className="hidden peer-checked:block md:block">
                <div className="absolute z-50 top-[100%] left-0 h-[75vh] w-[95vw] md:w-[inherit] md:h-[inherit] bg-white flex justify-center flex-col md:flex-row md:bg-none md:relative">
                    {links.map((link) => (
                        <NavbarItem key={link.href} {...link} />
                    ))}
                </div>
            </div>
            <label htmlFor="navbar-toggle" className="relative md:hidden">
                <Menu size={36} />
            </label>
        </>
    )
}