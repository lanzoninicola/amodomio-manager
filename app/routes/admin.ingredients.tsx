import { Link, Outlet, useActionData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { AlertError, AlertOk } from "~/components/layout/alerts/alerts";
import Container from "~/components/layout/container/container";
import { Button } from "~/components/ui/button";
import type { HttpResponse } from "~/utils/http-response.server";



export default function IngredientsOutlet() {


    return (
        <Container>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Ingredientes
                </h1>
                <Link to={`?action=new`}>
                    <Button type="button" className="flex gap-2">
                        <Plus size={16} />
                        Novo Ingrediente
                    </Button>
                </Link>
            </div>
            <Outlet />
            <IngredientsFormSubmissionAlert />
        </Container>
    )
}

function IngredientsFormSubmissionAlert() {
    const actionData = useActionData<HttpResponse | null>()
    const actionType = actionData?.payload?.action

    let errorTitle

    if (actionType === "ingredient-add-price") errorTitle = "Erro ao adicionar o preço"
    if (actionType === "ingredient-update-price") errorTitle = "Erro a atualizar o preço"
    if (actionType === "ingredient-delete-price") errorTitle = "Erro ao excluir o ingrediente"

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