import { Link, useSearchParams } from "@remix-run/react"

export interface TabItem {
    id: string
    name: string
    linkTo?: string
    default?: boolean
    disabled?: boolean
}

export interface TabsProps {
    tabs: TabItem[]
    bgStyle?: string
    activeTabStyle?: string
    inactiveTabStyle?: string
    clazzName?: HTMLDivElement["className"]
}


export default function Tabs({ tabs, bgStyle, activeTabStyle, inactiveTabStyle, clazzName }: TabsProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    let currentActiveTab = searchParams.get("tab")

    let baseActiveTabStyle = "rounded-md py-1"
    activeTabStyle = activeTabStyle ? `${baseActiveTabStyle} ${activeTabStyle}` : `${baseActiveTabStyle} bg-primary text-white`
    const backgroundStyle = bgStyle ? bgStyle : "bg-muted"


    return (
        <div className={`relative flex flex-wrap justify-center min-w-fit items-center p-1 rounded-md text-muted-foreground mb-6 ${backgroundStyle} ${clazzName}`}>

            {tabs.map((tab, idx) => {

                if (!currentActiveTab) {
                    if (tab.default === true) {
                        currentActiveTab = tab.id
                    }
                }

                const children = (
                    <div className={`${currentActiveTab === tab.id ? activeTabStyle : inactiveTabStyle} m-1`}>
                        <span>{tab.name}</span>
                    </div>
                )

                if (tab.linkTo && tab.disabled === false) return (
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