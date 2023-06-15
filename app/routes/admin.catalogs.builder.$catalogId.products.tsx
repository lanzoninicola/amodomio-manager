import { Outlet, useLoaderData } from "@remix-run/react";
import { sizeEntity } from "~/domain/size/size.entity.server";
import type { Size } from "~/domain/size/size.model.server";
import { ok } from "~/utils/http-response.server";

export async function loader() {
    const sizes = await sizeEntity.findAll()
    return ok({ sizes })
}


export interface SizeSelectionOutletContext {
    sizes: Size[]
}

export default function SizeSelectionOutlet() {
    const loaderData = useLoaderData<typeof loader>()
    const sizes = loaderData.payload.sizes as Size[] || []


    return (
        <>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Etapa 2</p>
            <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
                Seleçionar Tamanhos
            </h3>
            <Outlet context={{ sizes }} />
        </>
    )
}