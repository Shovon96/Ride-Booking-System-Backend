import App from "@/App";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router";

export const routers = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            // {
            //     path: "/",
            //     element: HomePage
            // }
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