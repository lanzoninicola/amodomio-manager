import { Link, useSearchParams } from "@remix-run/react"

export interface TabItem {
    id: string
    name: string
    linkTo?: string
    visibleCondition?: boolean
}

interface TabsProps {
    tabs: TabItem[]
}


export default function Tabs({ tabs }: TabsProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentActiveTab = searchParams.get("tab")

    const activeTabStyle = "bg-primary text-white rounded-md py-1"


    return (
        <div className="flex flex-wrap min-w-fit items-center p-1 rounded-md bg-muted text-muted-foreground mb-6">

            {tabs.map((tab, idx) => {

                const children = (
                    <div className={`${currentActiveTab === tab.id && activeTabStyle} m-1`}>
                        <span>{tab.name}</span>
                    </div>
                )

                if (tab.visibleCondition === false) return null

                if (tab.linkTo) return (
                    <Link key={idx} to={tab.linkTo} className="w-1/2 md:w-1/4 lg:w-1/6 text-center">
                        {children}
                    </Link >
                )


                return (
                    <div key={idx} className="w-1/2 md:w-1/4 lg:w-1/6 text-center" onClick={() => setSearchParams({ tab: tab.id })}>
                        {children}
                    </div>
                )


            })}

        </div >
    )
}