import type { ISidebarItems } from "@/types/index.types"


export const generateRoutes = (sidebarItems: ISidebarItems[]) => {
    return sidebarItems.flatMap(section => section.items.map(item => ({
        path: item.url,
        Component: item.component
    })))
}