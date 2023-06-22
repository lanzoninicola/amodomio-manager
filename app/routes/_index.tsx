import { type V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { LogoTransparent } from "~/components/primitives/logo/logo";


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
        <div className="relative h-screen bg-brand-orange z-0  overflow-hidden">
            <DecorativePizzaDeliverySentence />
            <div className="py-6 hidden md:visible">
                <LogoTransparent />
            </div>
            <BgImage />
            <div className="absolute w-full h-full grid place-items-center z-30">
                <LinkHomeButton />
            </div>
            <DecorativeAModoMioSentence />

        </div >
    )
}

function BgImage() {
    return (
        <img src="/images/pizza-burrata-bg.png" alt="Pizza burrata" className="z-20 absolute md:left-1/4 md:-top-40 md:w-auto md:h-auto w-[190%] max-w-none -left-24 top-12" />
    )
}

function LinkHomeButton() {
    return (
        <Link to="/cardapio">
            <div className="bg-brand-cloud px-8 py-2 rounded-md max-w-max">
                <div className="flex justify-center items-center gap-4 md:gap-8">
                    <LogoTransparent />
                    <span className="font-accent uppercase">cardápio</span>
                    <ArrowRight size={24} />
                </div>
            </div>
        </Link>
    )
}

function DecorativePizzaDeliverySentence() {
    return (
        <div className="relative ">
            <div className="absolute left-0  top-8 whitespace-nowrap">
                {Array.from({ length: 20 }).map((_, i) => <span key={i} className="font-accent text-sm md:hidden text-center uppercase">pizza delivery </span>)}
            </div>
        </div>
    )
}

function DecorativeAModoMioSentence() {
    return (
        <div className="relative ">
            <div className="absolute left-12 md:left-60 top-0 origin-top-left rotate-90 whitespace-nowrap bg-brand-orange">
                {Array.from({ length: 20 }).map((_, i) => <span key={i} className="font-logo text-lg md:text-3xl text-center">a modo mio</span>)}
            </div>
        </div>
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