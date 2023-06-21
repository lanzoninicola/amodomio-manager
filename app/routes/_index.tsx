import { type V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import { LogoTransparent } from "~/components/primitives/logo/logo";

import SplashScreen from "~/components/primitives/splash-screen/splash-screen";

export const meta: V2_MetaFunction = () => {
    return [
        { title: "Cardápio A Modio Mio" },
        {
            name: "description",
            content: "Bem vindo ao cardápio da Pizza Delivery A Modo Mio",
        },
    ];
};



export default function HomePage() {

    return (
        <div className="h-screen bg-brand-green-accent flex flex-col">
            <div className="py-6 md:py-12 flex justify-center">
                <LogoTransparent />
            </div>
            <div className="w-full h-full grid place-items-center">
                <Heading />
            </div>
            <div className="relative overflow-y-hidden h-full">
                <div className="absolute top-[20%] -left-40 md:left-1/2 md:-translate-x-1/2 -rotate-[84deg] w-[800px]" >
                    <img src="/images/pizza-linguiça.png" alt="Pizza retangular linguiça com batate ao forno" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-auto">
                    <Link to="/cardapio">
                        <div className="backdrop-blur-lg px-8 py-4 rounded-full shadow-lg">
                            <p className="text-white font-accent text-md md:text-xl uppercase text-center">Vai ao Cardápio</p>
                        </div>
                    </Link>

                </div>
            </div>
        </div >
    )
}

function Heading() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-accent uppercase text-3xl md:text-5xl text-center">a pizza</h1>
            <h1 className="font-logo text-5xl md:text-7xl text-center">a modo mio</h1>
            <h2 className="font-accent uppercase text-md md:text-xl text-center">não é a pizza<br /> comum</h2>
        </div>
    )
}