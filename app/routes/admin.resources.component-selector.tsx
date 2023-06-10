import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useFetcher, useSearchParams } from '@remix-run/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AlphabetSelector from '~/components/primitives/alphabet-selector/alphabet-selector';
import Folder from '~/components/primitives/folder/folder';
import GenericError from '~/components/primitives/generi-error/generic-error';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { IngredientEntity } from '~/domain/ingredient/ingredient.entity';
import { ProductEntity } from '~/domain/product/product.entity';
import toLowerCase from '~/utils/to-lower-case';

export async function loader({ request }: LoaderArgs) {

    const ingredientEntity = new IngredientEntity()
    const ingredients = await ingredientEntity.findAll()

    const productEntity = new ProductEntity()
    const productsAsIngredients = (await productEntity.findAll([{ field: "isAlsoAnIngredient", op: "==", value: true }], { includeAssociations: true }))

    const productComponents = [
        ...ingredients.map(i => ({ ...i, type: "ingredient" })),
        ...productsAsIngredients.map(i => ({ ...i, type: "product" }))]
        .sort((a, b) => a.name.localeCompare(b.name))

    return json({ productComponents })
}

export function ComponentSelector({ productId }: { productId: string | undefined }) {
    const productComponentsFetcher = useFetcher<typeof loader>()
    const productComponents = productComponentsFetcher.data?.productComponents

    const [searchParam, setSearchParams] = useSearchParams()

    const [search, setSearch] = useState({ type: "include", value: "" })

    const componentsFiltered = productComponents?.filter(pc => {

        if (search.value === "Limpar") return true

        const name = toLowerCase(pc.name)
        const searchValue = toLowerCase(search.value)

        if (search.type === "include") {
            return name.includes(searchValue)
        }

        if (search.type === "startsWith") {
            return name.startsWith(searchValue)
        }

        return true
    })

    if (!productId) {
        return (
            <GenericError message="O ID do produto não foi informado, não é possivel gerenciar a composição" />
        )
    }



    return (

        <div className="w-full border-2 border-muted rounded-lg">
            <Folder title="Adicionar componente" onClick={() => {
                productComponentsFetcher.submit(null, {
                    method: "GET",
                    action: "/admin/resources/component-selector"
                })
            }}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                            <div>
                                <Input type="search" placeholder="Pesquisar ingrediente" className="w-full" onChange={(e) => {
                                    setSearch({
                                        type: "include",
                                        value: e.target.value
                                    })
                                }} />
                            </div>
                            <Link to={`/admin/ingredients?action=new`}>
                                <Button type="button" className="flex gap-2 w-full">
                                    <Plus size={16} />
                                    Novo Ingrediente
                                </Button>
                            </Link>
                        </div>
                        <AlphabetSelector searchParam="componentNameStartsWith" dataset={productComponents?.map(p => p.name)}
                            onClick={(e) => {
                                setSearch({
                                    type: "startsWith",
                                    value: e.currentTarget.value
                                })
                            }} />
                    </div>
                    <ul className="flex flex-wrap">

                        {componentsFiltered?.map((c, idx) => {
                            const ingredientNameStartWith = searchParam.get('ingredientNameStartWith')

                            if (ingredientNameStartWith && c.name.startsWith(ingredientNameStartWith)) {
                                return <ComponentName key={idx} component={c} productId={productId} />
                            }

                            return <ComponentName key={idx} component={c} productId={productId} />
                        })}

                    </ul>
                </div>
            </Folder>

        </div>

    )
}

interface ComponentNameProps {
    component: { id?: string, name: string, type: string }
    productId: string
}


function ComponentName({ component, productId }: ComponentNameProps) {
    return (
        <li>
            <Form method="post">
                <Input type="text" hidden id="componentId" name="componentId" value={component.id} readOnly className="hidden" />
                <Input type="text" hidden id="componentType" name="componentType" value={component.type} readOnly className="hidden" />
                <Input type="text" hidden id="productId" name="productId" value={productId} readOnly className="hidden" />
                <Button type="submit" size="sm" name="_action" value="composition-add-component" className="w-full text-left" variant="ghost">
                    <span className="text-xs text-center">{component.name}</span>
                </Button>
            </Form>
        </li >
    )
}