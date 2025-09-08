import type { ISidebarItems } from "@/types/index.types";
import { lazy } from "react";

const RiderInfo = lazy(() => import("@/pages/RiderInfo"));

export const adminSidebarItems: ISidebarItems[] = [
    {
        title: "Admin Dashboard",
        url: "#",
        items: [
            {
                title: "Analytics",
                url: "/admin/rider-info",
                component: RiderInfo
            }
        ],
    },
    {
        title: "Rider Management",
        url: "#",
        items: [
            // {
            //     title: "Add Tour",
            //     url: "/admin/add-tour",
            //     component: AddTour
            // },
        ],
    },
]