import App from "@/App";
import Login from "@/pages/Login";
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
        Component: Login,
        path: "/login"
    }
]);