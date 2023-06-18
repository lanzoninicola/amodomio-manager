import { useEffect, useMemo, useState } from "react"
import toLowerCase from "~/utils/to-lower-case"

interface AutoCompleteDropdownProps<T> {
    dataset: T[],
    fieldToSearch: string & keyof T,
    searchValue: string,
    title?: string,
}

export default function AutoCompleteDropdown<T>({ dataset, fieldToSearch, searchValue, title }: AutoCompleteDropdownProps<T>) {

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
        <div className="absolute left-0 right-0 z-10 bg-white shadow-md rounded-md px-6 py-4 mt-2"
            onClick={() => setShow(false)}>
            <div className="flex flex-col gap-2" >
                {title && <span className="font-semibold text-xs">{title}</span>}
                <ul>
                    {
                        datasetFiltered.map((item, idx) => (
                            <li key={idx}>{item[fieldToSearch] as string}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}