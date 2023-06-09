import { Link, Outlet, useActionData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { AlertError, AlertOk } from "~/components/layout/alerts/alerts";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import type { HttpResponse } from "~/utils/http-response.server";



export default function SizesOutlet() {
    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Tamanhos
                </h1>
                <Link to={`/admin/sizes/new`}>
                    <Button type="button" className="flex gap-2">
                        <Plus size={16} />
                        Novo Tamanho
                    </Button>
                </Link>
            </div>
            <Outlet />
            <SizeFormSubmissionAlert />
        </Container>
    )
}

function SizeFormSubmissionAlert() {
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