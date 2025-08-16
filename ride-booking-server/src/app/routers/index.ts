import { Router } from "express";
import { UserRoutes } from "../modules/rider/rider.router";

export const router = Router()

const moduleRoutes = [
    {
        path: '/riders',
        route: UserRoutes
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})