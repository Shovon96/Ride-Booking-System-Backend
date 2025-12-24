import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";
import { vehicleProductRoute } from "../modules/vehicle-products/vehicle-product.route";

export const firstVersionRouter = Router();

const moduleRouter = [
    {
        path: "/user",
        route: userRoute
    },
    {
        path: "/auth",
        route: authRoute
    },
    {
        path: "/vehicle-products",
        route: vehicleProductRoute
    }
];

moduleRouter.forEach( router =>
{
    firstVersionRouter.use( router.path, router.route )
} );