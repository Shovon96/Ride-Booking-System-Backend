import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { RiderRole } from "../rider/rider.interface";


const router = Router()

router.post("/login", AuthController.creadentialsLogin)
router.post("/refresh-token", AuthController.getNewAccessToken)
router.post("/logout", AuthController.logout)
router.post('/chage-password', checkAuth(...Object.values(RiderRole)), AuthController.changePassword)

export const AuthRouter = router 