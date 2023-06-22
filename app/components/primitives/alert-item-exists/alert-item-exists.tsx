import { AlertTriangle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "~/components/ui/button"
import toLowerCase from "~/utils/to-lower-case"

interface AlertItemExistsProps<T> {
    dataset: T[],
    fieldToSearch: string & keyof T,
    searchValue: string,
    title?: string,
    forceCloseCondition?: boolean,
}

export default function AlertItemExists<T>({ dataset, fieldToSearch, searchValue, title }: AlertItemExistsProps<T>) {

    const [show, setShow] = useState(false)


    const datasetFiltered = useMemo(
        () => {
            if (!dataset) return []

            return dataset.filter(item => {
                const itemValue = toLowerCase(item[fieldToSearch] as string)
                const searchValueLowerCase = toLowerCase(searchValue)

                return itemValue.includes(searchValueLowerCase)
            })
        },
        [dataset, fieldToSearch, searchValue]
    )

    useEffect(() => {
        if ((searchValue.length > 0) && datasetFiltered.length > 0) {
            setShow(true)
        }

        if (searchValue.length === 0) {
            setShow(false)
        }

        if (datasetFiltered.length === 0 && searchValue.length > 0) {
            setShow(false)
        }
    }, [searchValue, datasetFiltered])


    if (!show) return null


    return (

        <div className="bg-orange-200 border-2 border-orange-400 rounded-md px-4 pt-4 pb-2 mt-2" >
            <div className="flex flex-col gap-2 mb-2" >
                <div className="flex gap-2">
                    <AlertTriangle className="text-orange-400" size={20} />
                    {title && <span className="font-semibold text-xs">{title}</span>}
                </div>
                <ul>
                    {
                        datasetFiltered.map((item, idx) => (
                            <li key={idx} className="text-xs">{item[fieldToSearch] as string}</li>
                        ))
                    }
                </ul>
            </div>
            <div className="flex justify-end">
                <Button size={"sm"} variant={"ghost"} className="text-xs " onClick={() => setShow(false)}>Fechar</Button>
            </div>
        </div >

    )
}