import { Router } from "express";
import { createRiderZodSchema } from "./rider.validation";
import { validateRequest } from "../../middleware/validate.request";
import { RiderController } from "./rider.controller";

const router = Router()

router.post('/register', validateRequest(createRiderZodSchema), RiderController.registetionRider)

export const UserRoutes = router;