import App from "@/App";
import AdminDashboardLayout from "@/components/layout/AdminDashboard";
// import { Role, type IRole } from "@/components/constant.ts/role";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebar.route";
import { generateRoutes } from "@/utils/generate.route";

export const routers = createBrowserRouter([
    {
        Component: App,
        path: "/",
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                Component: HomePage
            }
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
    }
]);