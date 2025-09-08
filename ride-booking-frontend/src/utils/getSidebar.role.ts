import { Role, type IRole } from "@/components/constant.ts/role";
import { adminSidebarItems } from "@/router/adminSidebar.route";


export const getSidebarItemsByRole = (userRole: IRole) => {
    switch (userRole) {
        case Role.ADMIN:
            return [...adminSidebarItems];
        // case Role.DRIVER:
        //     return [...userSidebarItems];
        // case Role.RIDER:
        //     return [...userSidebarItems];
        default:
            return []
    }
}