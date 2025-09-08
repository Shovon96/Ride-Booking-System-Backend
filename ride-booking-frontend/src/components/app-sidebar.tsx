import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "@/assets/Logo"
import { Link } from "react-router"
import { useUseInfoQuery } from "@/redux/features/auth.api"
import { getSidebarItemsByRole } from "@/utils/getSidebar.role"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { data: userData } = useUseInfoQuery(undefined)
    const dashboardData = {
        navMain: getSidebarItemsByRole(userData?.data?.role)

    }

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <div className="flex items-center my-2 gap-4 justify-center">
                <img className="rounded-full h-8 w-8" src="https://github.com/shadcn.png" alt="" />
                <p className="text-center">{userData?.data?.name}</p>
            </div>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {dashboardData.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={item.url}>{item.title}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}