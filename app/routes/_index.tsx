import { type V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import React from "react";
import Container from "~/components/layout/container/container";
import { LogoTransparent } from "~/components/primitives/logo/logo";

import SplashScreen from "~/components/primitives/splash-screen/splash-screen";
import { cn } from "~/lib/utils";

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
        <div className="relative h-screen bg-brand-orange">
            <div className="py-6 hidden md:visible">
                <LogoTransparent />
            </div>
            <BgImageTw />



        </div >
    )
}

function BgImage({ className }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative w-full h-full bg-size-cover bg-center bg-no-repeat",
                className
            )}
            style={{
                backgroundImage: "url('/images/pizza-burrata-bg.png')",
            }}>
        </ div>
    )
}

function BgImageTw({ className }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <img src="/images/pizza-burrata-bg.png" alt="Pizza burrata" className="absolute md:left-1/4 md:top-0 md:w-auto md:h-auto w-[190%] max-w-none -left-24 top-12" />
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