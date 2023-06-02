import { Link, Outlet, useLocation, useParams } from "@remix-run/react";


export function loader({ request }) {
    // const pathname = request.parsedURL.pathname
    // const productId = pathname.split("/").pop()




    return null
}


export default function SingleProduct() {
    const { productId } = useParams();
    const location = useLocation()
    const activeTab = [...location.pathname.split("/")].pop()

    const activeTabStyle = "bg-primary text-white rounded-md py-1"

    return (
        <>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Produto singolo</h3>
            </div>


            <div className="grid grid-cols-2 grid-rows-2 md:grid-rows-1 md:grid-cols-3 h-20 md:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-8">
                <Link to={`/admin/products/${productId}/info`} className="w-full text-center">
                    <div className={`${activeTab === "info" && activeTabStyle} ${activeTab}`}>
                        <span>Informações</span>
                    </div>

                </Link >
                <Link to={`/admin/products/${productId}/composition`} className="w-full text-center">
                    <div className={`${activeTab === "composition" && activeTabStyle} ${activeTab}`}>
                        <span>Composição</span>
                    </div>

                </Link >
                <Link to={`/admin/products/${productId}/dashboard`} className="w-full text-center">
                    <div className={`${activeTab === "dashboard" && activeTabStyle}`}>
                        <span>Estatisticas</span>
                    </div>
                </Link>
            </div >

            <Outlet />
        </>
    )
}