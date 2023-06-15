import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useFetcher, useSearchParams } from '@remix-run/react';
import { FieldPath } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AlphabetSelector from '~/components/primitives/alphabet-selector/alphabet-selector';
import Folder from '~/components/primitives/folder/folder';
import GenericError from '~/components/primitives/generi-error/generic-error';
import NoRecordsFound from '~/components/primitives/no-records-found/no-records-found';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { ProductEntity } from '~/domain/product/product.entity';
import type { Product } from '~/domain/product/product.model.server';
import { jsonStringify } from '~/utils/json-helper';
import toLowerCase from '~/utils/to-lower-case';

export async function loader({ request }: LoaderArgs) {

    const productEntity = new ProductEntity()
    const products = await productEntity.findAll([
        {
            field: new FieldPath("info", "type"),
            op: "in",
            value: ["ingredient", "prepared"]
        }
    ])

    return json({ products })
}

export function ComponentSelector({ parentProductId }: { parentProductId: string | undefined }) {
    const productComponentsFetcher = useFetcher<typeof loader>()
    const components = productComponentsFetcher.data?.products as Product[] | undefined | null


    const [searchParam, setSearchParams] = useSearchParams()

    const [search, setSearch] = useState({ type: "include", value: "" })

    const componentsFiltered = components?.filter(c => {

        if (search.value === "Limpar") return true

        const name = toLowerCase(c.name)
        const searchValue = toLowerCase(search.value)

        if (search.type === "include") {
            return name.includes(searchValue)
        }

        if (search.type === "startsWith") {
            return name.startsWith(searchValue)
        }

        return true
    })

    if (!parentProductId) {
        return (
            <GenericError message="O ID do produto não foi informado, não é possivel gerenciar a composição" />
        )
    }

    const newComponentButton = (
        <Link to={`/admin/products/new`}>
            <Button type="button" className="flex gap-2 w-full">
                <Plus size={16} />
                Criar novo componente
            </Button>
        </Link>
    )


    return (

        <div className="w-full border-2 border-muted rounded-lg">
            <Folder title="Adicionar componente" onClick={() => {
                productComponentsFetcher.submit(null, {
                    method: "GET",
                    action: "/admin/resources/component-selector"
                })
            }}>
                <div className="flex flex-col gap-4">

                    {(!components || components.length === 0) ? (
                        <div className="flex flex-col items-center">
                            <NoRecordsFound text="Nenhum componente cadastrado" />
                            <div className="max-w-[300px]">
                                {newComponentButton}
                            </div>

                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                                    <div>
                                        <Input type="search" placeholder="Pesquisar produto" className="w-full" onChange={(e) => {
                                            setSearch({
                                                type: "include",
                                                value: e.target.value
                                            })
                                        }} />
                                    </div>
                                    {newComponentButton}
                                </div>
                                <AlphabetSelector searchParam="componentNameStartsWith" dataset={components?.map(c => c.name)}
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
                                        return <ComponentName key={idx} component={c} parentProductId={parentProductId} />
                                    }

                                    return <ComponentName key={idx} component={c} parentProductId={parentProductId} />
                                })}
                            </ul>
                        </>
                    )}

                </div>
            </Folder>

        </div>

    )
}

interface ComponentNameProps {
    component: Product
    parentProductId: string
}


function ComponentName({ component, parentProductId }: ComponentNameProps) {
    return (
        <li>
            <Form method="post">
                <Input type="text" hidden id="parentId" name="parentId" value={parentProductId} readOnly className="hidden" />
                <Input type="text" hidden id="component" name="component" value={jsonStringify(component)} readOnly className="hidden" />
                <Button type="submit" size="sm" name="_action" value="composition-add-component" className="w-full text-left" variant="ghost">
                    <span className="text-xs text-center">{component.name}</span>
                </Button>
            </Form>
        </li >
    )
}