import { Router } from "express";
import { RiderRoutes } from "../modules/rider/rider.router";
import { AuthRouter } from "../modules/auth/auth.route";
import { RideRouter } from "../modules/rides/ride.route";
import { DriverRouter } from "../modules/driver/driver.route";
import { HistoryRouter } from "../modules/history/history.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/riders',
        route: RiderRoutes
    },
    {
        path: '/auth',
        route: AuthRouter
    },
    {
        path: '/ride',
        route: RideRouter
    },
    {
        path: '/driver',
        route: DriverRouter
    },
    {
        path: '/history',
        route: HistoryRouter
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})