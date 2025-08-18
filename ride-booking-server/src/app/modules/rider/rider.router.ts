import { Router } from "express";
import { createRiderZodSchema, updateRiderZodSchema } from "./rider.validation";
import { validateRequest } from "../../middleware/validate.request";
import { RiderController } from "./rider.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { RiderRole } from "./rider.interface";

const router = Router()

router.post('/register', validateRequest(createRiderZodSchema), RiderController.registetionRider)

router.get('/my-profile', checkAuth(...Object.values(RiderRole)), RiderController.myProfile)

router.get('/all-users', checkAuth(RiderRole.ADMIN), RiderController.getAllUsers)

router.get('/:id', checkAuth(RiderRole.ADMIN), RiderController.getSingleUser)

router.patch('/:id', validateRequest(updateRiderZodSchema), checkAuth(...Object.values(RiderRole)), RiderController.updateUser)

router.delete('/:id', checkAuth(...Object.values(RiderRole)), RiderController.deleteUser)

export const RiderRoutes = router;