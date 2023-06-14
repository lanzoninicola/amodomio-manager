import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { CategoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import { ProductEntity } from "~/domain/product/product.entity";
import type { ProductComponent } from "~/domain/product/product.model.server";
import { type Product } from "~/domain/product/product.model.server";
import type { HttpResponse } from "~/utils/http-response.server";
import { badRequest, ok } from "~/utils/http-response.server";
import { lastUrlSegment, urlAt } from "~/utils/url";

export interface ProductOutletContext {
    product: Product | null
    categories: Category[] | null
}


export async function loader({ request }: LoaderArgs) {
    const productId = urlAt(request.url, -2)

    if (!productId) {
        return null
    }

    const productEntity = new ProductEntity()
    const product = await productEntity.findById(productId)

    if (!product) {
        return badRequest({ message: "Produto não encontrado" })
    }

    let categories = null

    if (product?.id) {
        const categoryEntity = new CategoryEntity()
        categories = await categoryEntity.findAll()
    }


    return ok({
        product,
        categories
    })

}


export default function SingleProduct() {
    const location = useLocation()
    const activeTab = lastUrlSegment(location.pathname)
    const loaderData: HttpResponse | null = useLoaderData<typeof loader>()
    const product = loaderData?.payload?.product as Product
    const components = loaderData?.payload?.components as ProductComponent[]
    const categories = loaderData?.payload?.categories as Category[]
    const productId = product.id

    const activeTabStyle = "bg-primary text-white rounded-md py-1"

    const productType = product?.info?.type

    return (
        <>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">{`Produto: ${product?.name}` || "Produto singolo"}</h3>
            </div>


            <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 h-20 md:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-6">
                <Link to={`/admin/products/${productId}/info`} className="w-full text-center">
                    <div className={`${activeTab === "info" && activeTabStyle} ${activeTab}`}>
                        <span>Dados gerais</span>
                    </div>

                </Link >

                {
                    (productType === "kit" || productType === "manufactured") &&
                    <Link to={`/admin/products/${productId}/components`} className="w-full text-center">
                        <div className={`${activeTab === "components" && activeTabStyle} ${activeTab}`}>
                            <span>Componentes</span>
                        </div>

                    </Link >
                }
                {
                    (productType === "kit" || productType === "manufactured" || productType === "simple") &&
                    <Link to={`/admin/products/${productId}/menu`} className="w-full text-center">
                        <div className={`${activeTab === "menu" && activeTabStyle} ${activeTab}`}>
                            <span>Cardápio</span>
                        </div>
                    </Link >
                }
                <Link to={`/admin/products/${productId}/dashboard`} className="w-full text-center">
                    <div className={`${activeTab === "dashboard" && activeTabStyle}`}>
                        <span>Relatorio</span>
                    </div>
                </Link>
            </div >

            <Outlet context={{ product, components, categories }} />
        </>
    )
}