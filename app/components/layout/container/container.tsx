

interface ContainerProps {
    children: React.ReactNode;
    clazzName?: string
}

export default function Container({ children, clazzName }: ContainerProps) {
    return <div className={`md:max-w-[1024px] m-auto ${clazzName} p-4 lg:p-0`} data-element="container">
        {children}
    </div>
}

