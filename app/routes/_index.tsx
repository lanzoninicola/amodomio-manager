import type { LinksFunction } from "@remix-run/node";
import { type V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import Container from "~/components/layout/container/container";
import { LogoTransparent } from "~/components/primitives/logo/logo";

// https://smart-pizza-marketing.framer.ai/

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
        <>
            <div className="relative h-screen bg-brand-orange z-0 overflow-hidden">
                <BgImage />
                <div className="flex flex-col justify-end items-center gap-4 h-full">
                    <LogoTransparent />
                    <div className="flex flex-col p-6">
                        <Heading />
                        <div className="flex justify-center">
                            <LinkCardapio />
                        </div>
                    </div>
                </div>
            </div >
            {/* <Container>
                <section className="bg-red-500 p-4 w-full">
                    <h3>A nossa pizza</h3>
                    <p>Primeira coisa: a nossa pizza não é redonda! Ela é retangular, às vezes com umas curvinhas que a gente deixa de propósito. Nada de máquinas para fazer a massa e as formas, é só com as nossas mãos que tiramos um monte de massa. E no final, adoramos aquele toque rústico</p>
                    <p>Nós nos orgulhamos de não sermos convencionais. Afinal, pizza não precisa ser sempre igual, né? Ah, e não se preocupe em comer com as mãos, afinal, pizza retangular pede um jeitinho especial. Aqui, a diversão é garantida!</p>
                </section>
                <section className="bg-green-500 p-4 w-full">
                    <h3>O tamanhno</h3>
                    <p>Olha só, a gente trabalha com uma medida só: 35cm de comprimento e 25cm ou 27cm de largura. É uma pizza feita especialmente para dois, mas se você estiver com muita fome, dá pra encarar sozinho também! A nossa massa é tão levinha e o sabor é tão espetacular que é impossível resistir</p>
                    <p>Ah, e não se esqueça de trazer a galera! Afinal, uma pizza gostosa é ainda melhor quando compartilhada com pessoas especiais. Vamos fazer desse momento uma festa cheia de sabor e diversão!</p>
                </section>
                <section className="bg-blue-500 h-[700px] w-full">
                    <h3>A massa</h3>
                    <p>E aí, chegamos ao ponto alto: nossa massa é simplesmente sensacional! Crocante, aerada, leve... É uma verdadeira obra de arte inspirada na tradição romana e feita pelo um verdadeiro italiano. Já vou te adiantando: ninguém na cidade oferece uma massa tão espetacular quanto a nossa. Depois que você experimentar, pode apostar que não vai querer saber de outra pizza.</p>
                    <p>Poucos e simples ingredientes: farinha, agua, sal, fermento e o que mais... Ah sim... o toque e a experiença do chef!</p>
                </section>
                <section className="bg-brown-500 h-[700px] w-full">
                    <h3>As combinações</h3>
                    <p>Na nossa pizzaria, a criatividade é a nossa marca registrada. Estamos sempre inovando e criando novas combinações para surpreender os nossos clientes mais exigentes. Então, esteja preparado para se encantar com sabores que vão além do convencional, levando você a uma jornada gastronômica única..</p>
                    <p>Cada semana queremos oferecer uma no</p>
                </section>
            </Container> */}
        </>
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
        <Link to="/cardapio" className="p-12">
            <div className="bg-brand-cloud px-1 max-w-max h-full">
                <div className="flex justify-center items-center gap-1 mt-2 md:gap-8 h-full">
                    <span className="font-accent uppercase text-sm">cardápio</span>
                    <ArrowRight size={24} />
                </div>
            </div>
        </Link>
    )
}



function Heading() {
    return (
        <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2">
                <h2 className="font-accent uppercase text-xl tracking-widest">a pizza</h2>
                <div className="relative w-auto z-0">
                    <div className="absolute top-0 left-0 bottom-0 w-full bg-brand-cloud z-10"></div>
                    <h2 className="relative font-logo text-2xl text-black z-20 ml-1">a modo mio</h2>

                </div>
            </div>
            <h2 className="font-accent uppercase text-xl mb-1">não é uma pizza</h2>
            <div className="flex justify-center w-full bg-brand-cloud">
                <h2 className="relative font-accent uppercase text-2xl text-black z-20 tracking-[.55rem]">é a pizza.</h2>
            </div>
        </div>
    )
}
