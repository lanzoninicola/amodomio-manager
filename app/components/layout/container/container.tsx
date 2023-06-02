

interface ContainerProps {
    children: React.ReactNode;
    clazzName?: string
}

function Container({ children, clazzName }: ContainerProps) {
    return <div className={`md:max-w-[1024px] m-auto ${clazzName}`}>
        {children}
    </div>
}

export default Container;