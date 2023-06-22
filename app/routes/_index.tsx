import type { LinksFunction } from "@remix-run/node";
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

export const links: LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
    },
    {
        href: "https://fonts.googleapis.com/css2?family=Homemade+Apple&family=BioRhyme+Expanded:wght@700&display=swap",
        rel: "stylesheet",
    },
];



export default function HomePage() {

    return (
        <div className="relative h-screen bg-brand-orange z-0  overflow-hidden">
            <BgImage />
            <div className="flex items-end h-[85%] z-10 ">
                <div className="grid grid-cols-2 p-8">
                    <Heading />
                    <LinkCardapio />
                </div>
            </div>
        </div >
    )
}

function BgImage() {
    return (
        <img src="/images/pizza-burrata-bg.png" alt="Pizza burrata"
            className="z-20 absolute md:left-1/4 md:-top-40 md:w-auto md:h-auto w-[150%] max-w-none -left-4 -top-52" />
    )
}

function LinkCardapio() {
    return (
        <Link to="/cardapio">
            <div className="bg-brand-cloud px-8 py-2 rounded-md max-w-max h-full">
                <div className="flex flex-col justify-center items-center gap-1 mt-2 md:gap-8 h-full">
                    <span className="font-accent uppercase text-sm">cardápio</span>
                    <ArrowRight size={24} />
                </div>
            </div>
        </Link>
    )
}



function Heading() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="flex flex-col">
                <span className="font-accent uppercase text-xl">a pizza</span>
                <span className="font-logo text-2xl text-brand-cloud font-bold">a modo mio</span>
                <span className="font-accent uppercase text-xl">não é a</span>
                <span className="font-accent uppercase text-xl tracking-[10px]">pizza</span>
                <span className="font-accent uppercase text-xl tracking-[3px]">comum</span>
            </h1>
        </div>
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