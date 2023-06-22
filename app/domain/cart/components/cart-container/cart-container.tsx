import Container from "~/components/layout/container/container"



interface CartContainerProps {
    children: React.ReactNode
}

export default function CartContainer({ children }: CartContainerProps) {


    return <Container clazzName="h-screen bg-white">{children}</Container>
}