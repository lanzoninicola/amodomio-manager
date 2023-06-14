import { type LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { categoryEntity } from "~/domain/category/category.entity.server"
import { type Category } from "~/domain/category/category.model.server"
import type { HttpResponse } from "~/utils/http-response.server";
import { ok } from "~/utils/http-response.server"

export async function loader() {

    const categoryEntity = new CategoryEntity()
    const categories = await categoryEntity.findAll() as Category[]

    return ok({ categories })
}

interface CategorySelectorProps {
    defaultValue?: string,
    clazzName?: React.HTMLAttributes<HTMLDivElement>["className"]
}

export function CategorySelector({ defaultValue, clazzName }: CategorySelectorProps) {
    const loaderData: HttpResponse | null = useLoaderData<typeof loader>()
    const categories: Category[] | null = loaderData?.payload.categories

    console.log(loaderData)


    return (
        <Select name="categoryId" defaultValue={defaultValue} required>
            <SelectTrigger>
                <SelectValue placeholder="Seleçionar categoria" className="text-xs text-muted" />
            </SelectTrigger>
            <SelectContent className={clazzName}>
                <SelectGroup>
                    {categories && categories.map(c => {

                        if (c?.id === undefined) {
                            return null
                        }

                        return (
                            <SelectItem key={c.id} value={c.id}>
                                {c.name}
                            </SelectItem>
                        )

                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}