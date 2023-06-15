import { Outlet, useLoaderData } from "@remix-run/react";
import { ProductEntity } from "~/domain/product/product.entity";
import type { Product } from "~/domain/product/product.model.server";
import { ok } from "~/utils/http-response.server";


export async function loader() {
    const productEntity = new ProductEntity()
    const products = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "pizza"
    }])

    return ok({ products })
}


export interface CatalogBuilderOutletContext {
    products: Product[]
}


export default function CatalogBuilder() {
    const loaderData = useLoaderData<typeof loader>()
    const products = loaderData.payload.products as Product[] || []

    return (
        <>
            <div className="mb-8">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                    Gerador de catálogo
                </h3>
            </div>
            <Outlet context={{ products }} />
        </>
    )
}

