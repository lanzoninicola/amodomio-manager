import { Link, Outlet, useActionData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { AlertError, AlertOk } from "~/components/layout/alerts/alerts";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import type { HttpResponse } from "~/utils/http-response.server";



export default function ProductsOutlet() {
    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Produtos
                </h1>
                <Link to={`/admin/products/new`}>
                    <Button type="button" className="flex gap-2">
                        <Plus size={16} />
                        Novo Produto
                    </Button>
                </Link>
            </div>
            <Outlet />
            {/* <ProductFormSubmissionAlert /> */}
        </Container>
    )
}

function ProductFormSubmissionAlert() {
    const actionData = useActionData<HttpResponse | null>()

    let errorTitle

    if (actionData && actionData?.status > 201) {
        return (
            <AlertError title={errorTitle} message={(actionData && actionData.message) || ""} />
        )
    }

    if (actionData && (actionData?.status === 200 || actionData?.status === 201)) {
        return (
            <AlertOk />
        )
    }

    return null

}