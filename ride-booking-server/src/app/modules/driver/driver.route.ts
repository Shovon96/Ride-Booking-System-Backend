import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { RiderRole } from "../rider/rider.interface";
import { DriverController } from "./driver.controller";
import { validateRequest } from "../../middleware/validate.request";
import { updateRideStatusSchema } from "../rides/ride.validation";

const router = Router();

router.post(
  '/accept/:rideId',
  checkAuth(RiderRole.DRIVER),
  DriverController.acceptRideByDriver
);

router.patch(
  '/status/:id',
  checkAuth(RiderRole.DRIVER),
  validateRequest(updateRideStatusSchema),
  DriverController.updateRideStatus
);

router.post('/reject/:id', checkAuth(RiderRole.DRIVER), DriverController.rejectRide);

export const DriverRouter = router;