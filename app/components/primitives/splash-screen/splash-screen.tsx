import { LogoOutlineWords, ItalianFlagSmall, Vespa } from "../logo/logo";
import useEasterEggRedirection from "~/hooks/use-easter-egg-redirection";


export default function SplashScreen() {
    const { increaseAmount } = useEasterEggRedirection({ redirectTo: "/admin" })

    return (
        <div className="relative bg-brand-green h-screen w-screen">
            <div className="grid place-items-center w-screen h-[75%]">
                <div className="absolute z-0 ">
                    <div className="animate-rotate-360-slow hover:animate-none">
                        <LogoOutlineWords />
                    </div>
                </div>
                <div className="absolute z-10 grid place-items-center w-screen h-screen">
                    <div className="relative flex flex-col items-center">
                        <ItalianFlagSmall className="absolute -top-14" />
                        <div onClick={increaseAmount} className="z-30">
                            <h1 className="font-logo text-white text-3xl" >a modo mio</h1>
                        </div>
                        <Vespa size="sm" className="absolute -bottom-12" />
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 w-screen h-screen">
                <div className="relative top-[70%]">
                    <Cloud className="animate-move-slower absolute" w={"120"} />
                    <Cloud className="animate-move-slowest absolute top-[15px]" w={"180"} />
                    <Cloud className="animate-move absolute top-[30px]" w={"90"} />
                    <Cloud className="animate-move-slow absolute top-[70px]" w={"70"} />
                </div>
            </div>
            <div className="absolute inset-0 w-screen h-screen">
                <div className="relative top-[85%] flex flex-col justify-center items-center">
                    <Vespa color="white" className="animate-bounce" />
                    <div className="w-[200px] h-1 bg-amber-950"></div>
                </div>
            </div>

        </div>



    )
}

interface CloudProps {
    w: string,
    className?: string
}

function Cloud({ w, ...props }: CloudProps) {
    return (
        <img src="/images/cloud.png" alt="nuvem" width={`${w}px`}  {...props} />
    )
}