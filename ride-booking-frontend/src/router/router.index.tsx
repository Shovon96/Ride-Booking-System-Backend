import App from "@/App";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router";

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
    {
        Component: Register,
        path: "/register"
    },
    {
        Component: Login,
        path: "/login"
    }
]);