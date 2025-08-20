import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { RiderRole } from "../rider/rider.interface";
import { DriverController } from "./driver.controller";

const router = Router();

router.post(
    '/:rideId/accept',
    checkAuth(RiderRole.DRIVER),
    DriverController.acceptRideByDriver
);


export const DriverRouter = router;