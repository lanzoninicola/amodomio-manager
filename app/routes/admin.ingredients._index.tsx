import type { ActionArgs } from "@remix-run/node"
import { useLoaderData, Form, Link } from "@remix-run/react"
import { Edit, MoreHorizontal, PinOff } from "lucide-react"
import Container from "~/components/layout/container/container"
import SubmitButton from "~/components/primitives/submit-button/submit-button"
import { TableTitles, TableRows, TableRow, Table, DeleteItemButton } from "~/components/primitives/table-list"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import type { Ingredient } from "~/domain/ingredient/ingredient.entity";
import { ingredientEntity } from "~/domain/ingredient/ingredient.entity"
import useFormSubmissionnState from "~/hooks/useFormSubmissionState"
import errorMessage from "~/utils/error-message"
import { badRequest, ok, serverError } from "~/utils/http-response.server"
import tryit from "~/utils/try-it"


export async function loader() {
    const [err, ingredients] = await tryit(ingredientEntity.findAll())
    if (err) {
        return serverError(errorMessage(err))
    }

    return ok({ ingredients })
}


export async function action({ request }: ActionArgs) {
    let formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);



    if (_action === "ingredient-delete") {

        const ingredientId = values.id as string

        const [err, ingredients] = await tryit(ingredientEntity.delete(ingredientId))
        if (err) {
            return badRequest(errorMessage(err))
        }
    }

    return null
}



export default function IngredientsIndex() {
    // const responseData = useActionData<typeof action>();
    const loaderData = useLoaderData<typeof loader>()
    const ingredients: Ingredient[] = loaderData?.payload.ingredients

    return (
        <Container>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Lista de ingredientes</h3>
            </div>
            <Table>
                <TableTitles
                    clazzName="grid-cols-4"
                    titles={[
                        "Ações",
                        "Nome",
                        "Criado em",
                        "Atualizado em",
                    ]}
                />
                <TableRows>
                    {ingredients.map((i) => {
                        return <IngredientTableRow key={i.id} ingredient={i} clazzName="grid-cols-4" />;
                    })}
                </TableRows>
            </Table>

            {/* {responseData && responseData?.status >= 400 && (
                <AlertError title={responseData?.action} message={responseData?.message} />)} */}
        </Container>
    )
}


interface IngredientTableRowProps {
    ingredient: Ingredient;
    clazzName?: string;
}

function IngredientTableRow({ ingredient, clazzName }: IngredientTableRowProps) {
    const formSubmissionState = useFormSubmissionnState()

    return (

        <Form method="post" >
            <TableRow
                row={ingredient}
                isProcessing={formSubmissionState === "inProgress"}
                clazzName={`${clazzName}`}
            >
                <div className="flex gap-2 md:gap-4 items-center">

                    <Link to={`/admin/products/${ingredient.id}/info`}>
                        <Button type="button" variant="ghost" size={"sm"}>
                            <Edit size={16} />
                        </Button>
                    </Link>
                    <DeleteItemButton actionName="ingredient-delete" />
                </div>
                <div>
                    <Input type="hidden" name="id" value={ingredient.id} />
                    <Input name="name" defaultValue={ingredient.name} className="border-none w-full" />
                </div>

            </TableRow>
        </Form>
    )
}





