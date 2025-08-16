import { Router } from "express";
import { createRiderZodSchema } from "./rider.validation";

const router = Router()

router.post('/register', RiderController.registetionRider)

export const UserRoutes = router;