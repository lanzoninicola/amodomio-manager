import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { catalogEntity } from "~/domain/catalog/catalog.entity.server";
import type { Catalog, CatalogType } from "~/domain/catalog/catalog.model.server";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import { ProductEntity } from "~/domain/product/product.entity";
import type { Product } from "~/domain/product/product.model.server";
import { SizeEntity } from "~/domain/size/size.entity.server";
import type { Size } from "~/domain/size/size.model.server";
import { ok } from "~/utils/http-response.server";


export async function loader() {
    const catalogs = await catalogEntity.findAll()
    const catalogTypes = catalogEntity.getCatalogTypes()
    const productEntity = new ProductEntity()
    const products = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "pizza"
    }])
    const sizeEntity = new SizeEntity()
    const sizes = await sizeEntity.findAll()
    const categories = await categoryEntity.findAll()

    const toppings = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "topping"
    }])


    return ok({ catalogs, catalogTypes, products, sizes, toppings, categories })
}


export interface CatalogBuilderOutletContext {
    catalogs: Catalog[]
    catalogTypes: CatalogType[]
    products: Product[]
    sizes: Size[]
    toppings: Product[]
    categories: Category[]
}


export default function CatalogBuilder() {
    const loaderData = useLoaderData<typeof loader>()
    const catalogs = loaderData.payload.catalogs as Catalog[] || []
    const catalogTypes = loaderData.payload.catalogTypes as CatalogType[] || []
    const products = loaderData.payload.products as Product[] || []
    const sizes = loaderData.payload.sizes as Size[] || []
    const toppings = loaderData.payload.toppings as Product[] || []
    const categories = loaderData.payload.categories as Category[] || []

    return (
        <>
            <div className="mb-8">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                    Gerador de catálogo
                </h3>
            </div>
            <Outlet context={{ catalogs, catalogTypes, products, sizes, toppings, categories }} />
        </>
    )
}

