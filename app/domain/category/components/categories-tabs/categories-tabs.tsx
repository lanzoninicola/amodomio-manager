import Tabs from "~/components/primitives/tabs/tabs"
import { type Category } from "../../category.model.server"
import toLowerCase from "~/utils/to-lower-case"



interface CategoriesTabsProps {
    categories: Category[]
    includeAll?: boolean
    includeEmpty?: boolean
    [x: string]: any
}

export default function CategoriesTabs({ categories, includeAll = false, includeEmpty = true, ...props }: CategoriesTabsProps) {
    const categoryTabs = categories.map(category => (
        {
            id: category.id ?? "",
            name: category.name,
            linkTo: `/admin?tab=${category.name}&categoryId=${category.id}`,
            default: toLowerCase(category.name) === "classica"
        }
    ))


    const tabs = [
        ...categoryTabs
    ]

    if (includeAll) tabs.push({
        id: "all",
        name: "Todas",
        linkTo: "/admin?tab=all",
        default: true
    })

    if (includeEmpty) tabs.push({
        id: "empty",
        name: "Sem Categoria",
        linkTo: "/admin?tab=empty",
        default: true
    })


    return <Tabs tabs={tabs} {...props} />
}