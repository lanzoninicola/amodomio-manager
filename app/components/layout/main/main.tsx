

interface MainProps {
    children: React.ReactNode;
}

function Main({ children }: MainProps) {
    return <main className="relative bg-tea-100 min-h-screen min-w-screen z-10 p-8">
        {children}
    </main>
}

export default Main;