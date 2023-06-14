import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import { type Catalog } from "~/domain/catalog/catalog.model.server";
import type { HttpResponse } from "~/utils/http-response.server";
import { badRequest, ok } from "~/utils/http-response.server";
import { lastUrlSegment, urlAt } from "~/utils/url";
import { catalogEntity } from "~/domain/catalog/catalog.entity.server";

export interface CatalogOutletContext {
    catalog: Catalog | null
    categories: Category[] | null
}


export async function loader({ request }: LoaderArgs) {
    const catalogId = urlAt(request.url, -2)

    if (!catalogId) {
        return null
    }

    const catalog = await catalogEntity.findById(catalogId)

    if (!catalog) {
        return badRequest({ message: "Produto não encontrado" })
    }

    let categories = null

    if (catalog?.id) {
        categories = await categoryEntity.findAll()
    }

    return ok({
        catalog,
        categories
    })

}


export default function SingleCatalog() {
    const location = useLocation()
    const activeTab = lastUrlSegment(location.pathname)
    const loaderData: HttpResponse | null = useLoaderData<typeof loader>()
    const catalog = loaderData?.payload?.catalog as Catalog
    const categories = loaderData?.payload?.categories as Category[]
    const catalogId = catalog.id

    const activeTabStyle = "bg-primary text-white rounded-md py-1"

    return (
        <>
            <div className="mb-16">
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">{`Catálogo: ${catalog?.name}` || "Catálogo"}</h3>
                {catalog?.type && <h4 className="textlg font-semibold text-muted-foreground">{`Tipo: ${catalog?.type}`}</h4>}
            </div>


            <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-5 md:grid-rows-1 h-20 md:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-6">
                <Link to={`/admin/catalogs/${catalogId}/items`} className="w-full text-center">
                    <div className={`${activeTab === "items" && activeTabStyle} ${activeTab}`}>
                        <span>Iténs</span>
                    </div>

                </Link >
            </div >

            <Outlet context={{ catalog, categories }} />
        </>
    )
}