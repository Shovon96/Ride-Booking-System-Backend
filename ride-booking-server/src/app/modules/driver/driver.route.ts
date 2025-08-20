import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { RiderRole } from "../rider/rider.interface";
import { DriverController } from "./driver.controller";
import { validateRequest } from "../../middleware/validate.request";
import { updateRideStatusSchema } from "../rides/ride.validation";

const router = Router();

router.post(
    '/:rideId/accept',
    checkAuth(RiderRole.DRIVER),
    DriverController.acceptRideByDriver
);

router.patch(
  '/:id/status',
  checkAuth(RiderRole.DRIVER),
  validateRequest(updateRideStatusSchema),
  DriverController.updateRideStatus
);

export const DriverRouter = router;