import Tabs from "~/components/primitives/tabs/tabs"
import { type Category } from "../../category.model.server"



interface CategoriesTabsProps {
    categories: Category[]
    includeAll?: boolean
    [x: string]: any
}

export default function CategoriesTabs({ categories, includeAll = true, ...props }: CategoriesTabsProps) {
    const categoryTabs = categories.map(category => (
        {
            id: category.id ?? "",
            name: category.name,
            linkTo: `/admin?tab=${category.name}&categoryId=${category.id}`,
            default: category.name === "Classica"
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


    return <Tabs tabs={tabs} {...props} />
}