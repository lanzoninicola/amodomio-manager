

interface ContainerProps {
    children: React.ReactNode;
    clazzName?: string
}

function Container({ children, clazzName }: ContainerProps) {
    return <div className={`md:max-w-[1400px] m-auto ${clazzName}`}>
        <div className="md:max-w-[768px] m-auto">
            {children}
        </div>
    </div>
}

export default Container;