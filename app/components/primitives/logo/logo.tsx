
interface LogoProps {
    clazzName?: string;
}

export function LogoTransparent({ clazzName }: LogoProps) {


    return (
        <div className={`w-[60px] md:w-[80px] ${clazzName}`}>
            <img src="/images/logo-transparent.png" alt="Logo A Modo Mio" />
        </div>
    )
}

export function LogoOutlineWords() {

    return (
        <img src="/images/logo-outline-words.png" alt="Logo A Modo Mio" width="300px" height="300px" />
    )
}

export function ItalianFlagSmall({ ...props }) {

    return (
        <img src="/images/italian-flag-small-bg-green.png" alt="Logo A Modo Mio" {...props} />
    )
}

type VespaProps = {
    size?: "sm" | "md" | "lg";
    className?: string;
    color?: "white" | "black"
};

export function Vespa({ size = "md", color = "white", ...props }: VespaProps) {
    let width = "60px";
    let height = "23px";

    if (size === "sm") {
        width = "30px";
        height = "12px";
    }

    return (
        <img src={`/images/vespa-${color}.svg`} alt="Vespa A Modo Mio" width={width} height={height} {...props} />
    )
}

