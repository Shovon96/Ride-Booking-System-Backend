import { Router } from "express";
import { AuthContoller } from "./auth.controller";


const router = Router()

router.post("/login", AuthContoller.creadentialsLogin)
router.post("/refresh-token",AuthContoller.getNewAccessToken)
router.post("/logout",AuthContoller.logout)

export const AuthRouter = router 