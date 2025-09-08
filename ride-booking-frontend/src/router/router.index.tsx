import App from "@/App";
import AdminDashboardLayout from "@/components/layout/AdminDashboard";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebar.route";
import { generateRoutes } from "@/utils/generate.route";
import TakeRide from "@/pages/riderPages/TakeRide";
import { AuthValidation } from "@/utils/AuthValidation";
import { Role, type IRole } from "@/components/constant.ts/role";
import Unauthorized from "@/pages/Unauthorized";

export const routers = createBrowserRouter([
    {
        Component: App,
        path: "/",
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                Component: HomePage
            },
            // For Rider
            {
                Component: AuthValidation(TakeRide, Role.RIDER as IRole),
                path: "/take-ride"
            },
        ]
    },
    // For Admin Dashboard
    {
        // Component: authValidation(DashboardLayout, Role.ADMIN as IRole),
        Component: AdminDashboardLayout,
        path: '/admin',
        children: [
            { index: true, element: <Navigate to="/admin/analytics" /> },
            ...generateRoutes(adminSidebarItems)
        ]
    },
    {
        Component: Register,
        path: "/register"
    },
    {
        Component: Login,
        path: "/login"
    },
    {
        Component: Unauthorized,
        path: "/unauthorized"
    }
]);