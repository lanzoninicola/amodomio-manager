import { Link } from "@remix-run/react";
import { X } from "lucide-react";

interface AlphabetSelectorProps {
    searchParam?: string;
    dataset?: string[];
    onClick?: React.MouseEventHandler<HTMLInputElement>;
}

export default function AlphabetSelector({ searchParam, dataset, onClick }: AlphabetSelectorProps) {
    let letters = [];


    if (dataset && dataset.length > 0) {
        letters = [...new Set(dataset.map(s => s.charAt(0).toUpperCase()))];
    } else {
        letters = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'Á', 'À', 'Ã', 'Â', 'É', 'È', 'Ê', 'Í', 'Ì', 'Î', 'Ó', 'Ò', 'Õ', 'Ô',
            'Ú', 'Ù', 'Û', 'Ç'
        ];
    }


    return (
        <div className="flex flex-wrap gap-2 md:gap-0 justify-center md:justify-start items-center" data-element="alphabet-selector">
            <Link to={`?${searchParam}=${"all"}`}>
                <input className="cursor-pointer text-xs w-10 h-8 md:w-10 md:h-6 flex justify-center items-center mr-2" onClick={onClick} value="Limpar" readOnly />
            </Link>
            {letters.map((letter, idx) => {
                return (
                    <Link to={`?${searchParam}=${letter}`} key={idx}>
                        <input className="cursor-pointer text-center text-xs w-8 h-8 md:w-6 md:h-6 flex justify-center items-center border border-gray-300 rounded-full mx-1 my-1" value={letter} onClick={onClick} readOnly />
                    </Link>
                )
            })}
        </div>
    )

}