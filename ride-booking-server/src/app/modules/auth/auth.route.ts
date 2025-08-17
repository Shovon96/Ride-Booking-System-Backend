import { Router } from "express";
import { AuthContoller } from "./auth.controller";


const router = Router()

router.post("/login", AuthContoller.creadentialsLogin)

export const AuthRouter = router 