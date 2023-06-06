import { useLoaderData, Form, Link } from "@remix-run/react"
import { MoreHorizontal, PinOff } from "lucide-react"
import Container from "~/components/layout/container/container"
import { TableTitles, TableRows, TableRow, Table } from "~/components/primitives/table-list"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { IngredientEntity } from "~/domain/ingredient/ingredient.entity"
import type { Ingredient } from "~/domain/ingredient/ingredient.model.server"
import useFormSubmissionnState from "~/hooks/useFormSubmissionState"
import { ok, serverError } from "~/utils/http-response.server"
import tryit from "~/utils/try-it"


export async function loader() {
    const ingredientEntity = new IngredientEntity()
    const [err, ingredients] = await tryit(ingredientEntity.findAll())
    if (err) {
        return serverError(err)
    }

    return ok({ ingredients })
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
                <div className="flex gap-2 md:gap-4 mb-2">
                    <Link to={`/admin/ingredients/${ingredient.id}/info`}>
                        <Button type="button" >
                            <MoreHorizontal size={16} />
                        </Button>
                    </Link>
                    <Button variant="destructive" type="submit" name="_action" value="ingredient-disable">
                        <PinOff size={16} />
                    </Button>

                </div>
                <div>
                    <Input type="hidden" name="id" value={ingredient.id} />
                    <Input name="name" defaultValue={ingredient.name} className="border-none w-full" />
                </div>

            </TableRow>
        </Form>
    )
}





