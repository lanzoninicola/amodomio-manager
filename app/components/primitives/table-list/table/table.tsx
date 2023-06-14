


interface TableProps {
    children: React.ReactNode
    twWidth?: string
}

export default function Table({ children, twWidth }: TableProps) {

    const clazzName = twWidth ? twWidth : "min-w-[600px]"


    return (
        <div data-element="table" className={`rounded-md border overflow-y-auto md:overflow-y-visible ${twWidth}`}>
            <div className={clazzName}>
                {children}
            </div>
        </div>)
}