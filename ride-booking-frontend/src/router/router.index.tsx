import App from "@/App";
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
]);