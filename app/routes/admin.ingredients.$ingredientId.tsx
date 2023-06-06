import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { IngredientEntity, type IngredientWithAssociations } from "~/domain/ingredient/ingredient.entity";
import { type Ingredient } from "~/domain/ingredient/ingredient.model.server";
import { badRequest, ok } from "~/utils/http-response.server";
import { lastUrlSegment, urlAt } from "~/utils/url";

export interface IngredientOutletContext {
    ingredient: IngredientWithAssociations | Ingredient | null
}


export async function loader({ request }: LoaderArgs) {
    const ingredientId = urlAt(request.url, -2)

    if (!ingredientId) {
        return null

    }
    const ingredientEntity = new IngredientEntity()
    const ingredient = await ingredientEntity.findById(ingredientId) as IngredientWithAssociations

    if (!ingredient) {
        return badRequest({ message: "Produto não encontrado" })
    }

    return ok({ ingredient })
}


export default function SingleProduct() {
    const location = useLocation()
    const activeTab = lastUrlSegment(location.pathname)
    const loaderData = useLoaderData<typeof loader>()
    const ingredient = loaderData?.payload?.ingredient as IngredientWithAssociations
    const ingredientId = ingredient.id

    const activeTabStyle = "bg-primary text-white rounded-md py-1"

    return (
        <>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">{`Produto: ${ingredient?.name}` || "Produto singolo"}</h3>
            </div>


            <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 h-20 md:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-6">
                <Link to={`/admin/ingredients/${ingredientId}/info`} className="w-full text-center">
                    <div className={`${activeTab === "info" && activeTabStyle} ${activeTab}`}>
                        <span>Informações</span>
                    </div>

                </Link >
                <Link to={`/admin/ingredients/${ingredientId}/prices`} className="w-full text-center">
                    <div className={`${activeTab === "menu" && activeTabStyle} ${activeTab}`}>
                        <span>Preços</span>
                    </div>
                </Link >
                <Link to={`/admin/ingredients/${ingredientId}/menu`} className="w-full text-center">
                    <div className={`${activeTab === "menu" && activeTabStyle} ${activeTab}`}>
                        <span>Cardápio</span>
                    </div>

                </Link >
                <Link to={`/admin/ingredients/${ingredientId}/dashboard`} className="w-full text-center">
                    <div className={`${activeTab === "dashboard" && activeTabStyle}`}>
                        <span>Relatorio</span>
                    </div>
                </Link>
            </div >

            <Outlet context={{ ingredient }} />
        </>
    )
}