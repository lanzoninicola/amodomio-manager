

interface ContainerProps {
    children: React.ReactNode;
    clazzName?: React.StyleHTMLAttributes<HTMLDivElement>["className"];
}

export default function Container({ children, clazzName }: ContainerProps) {
    return <div className={`relative md:max-w-[1024px] m-auto p-4 lg:p-0 ${clazzName}`} data-element="container">
        {children}
    </div>
}

