


export default function Table({ children }: { children: React.ReactNode }) {
    return (
        <div data-element="table" className=" rounded-md border overflow-y-auto">
            <div className="min-w-[600px]">
                {children}
            </div>
        </div>)
}