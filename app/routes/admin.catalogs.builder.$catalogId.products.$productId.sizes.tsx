import { Outlet, useLoaderData } from "@remix-run/react";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Topping } from "~/domain/pizza/pizza.entity.server";
import { ProductEntity } from "~/domain/product/product.entity";
import type { Size } from "~/domain/size/size.model.server";
import { ok } from "~/utils/http-response.server";

export async function loader() {
    const productEntity = new ProductEntity()
    const categories = await categoryEntity.findAll()
    const toppings = await productEntity.findAll([{
        field: "info.type",
        op: "==",
        value: "topping"
    }])


    return ok({ categories, toppings })
}


export default function SizesCatalogBuilder() {
    const loaderData = useLoaderData<typeof loader>()
    const categories = loaderData.payload.categories as Size[] || []
    const toppings = loaderData.payload.toppings as Topping[] || []


    return (
        <>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Etapa 3</p>
            <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
                Seleçionar Sabores
            </h3>
            <Outlet context={{ categories, toppings }} />
        </>
    )
}