import { Search } from "lucide-react";
import { useState } from "react";

interface SearchableInputProps {
    dataset: Record<any, any>[]
    searchPropName: string
    inputName?: string
}

export default function SearchableInput({ dataset, searchPropName, inputName }: SearchableInputProps) {
    const [records, setRecords] = useState(dataset)
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [valueSelected, setValueSelected] = useState(undefined)

    function filterRecords(e: React.ChangeEvent<HTMLInputElement>) {
        setShowSearchResults(true)
        const value = e.target.value
        if (value.length === 0) {
            setRecords(dataset)
        } else {
            setRecords(dataset.filter(record => record[searchPropName].toLowerCase().includes(value.toLowerCase())))
        }
    }


    return (
        <div className="relative flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <div className="flex justify-between items-center gap-2">
                <input type="text" className="outline-none" onChange={filterRecords} name={inputName || searchPropName} value={valueSelected} />
                <Search size={16} />
            </div>
            {showSearchResults === true && (
                <div className="absolute z-10 bg-white bottom-10 p-4 shadow-sm">

                    <ul className="overflow-y-scroll">
                        {records.map((record) => (
                            <li
                                className="min-w-[200px] cursor-pointer py-1 px-2 hover:bg-muted-foreground transition-colors"
                                key={record.id}
                                onClick={() => {
                                    setShowSearchResults(false)
                                    setValueSelected(record[searchPropName])
                                }}
                            >
                                {record[searchPropName]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}