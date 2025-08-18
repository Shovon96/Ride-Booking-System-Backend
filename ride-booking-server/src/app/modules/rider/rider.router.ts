import { Router } from "express";
import { createRiderZodSchema } from "./rider.validation";
import { validateRequest } from "../../middleware/validate.request";
import { RiderController } from "./rider.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { RiderRole } from "./rider.interface";

const router = Router()

router.post('/register', validateRequest(createRiderZodSchema), RiderController.registetionRider)

router.get('/my-profile', checkAuth(...Object.values(RiderRole)), RiderController.myProfile)

export const UserRoutes = router;