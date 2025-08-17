import { Router } from "express";
import { UserRoutes } from "../modules/rider/rider.router";
import { AuthRouter } from "../modules/auth/auth.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/riders',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRouter
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})