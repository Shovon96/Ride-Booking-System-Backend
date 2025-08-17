import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { setAuthCookie } from "../../utils/setCookie"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from 'http-status-codes'
import { Authservice } from "./auth.service"

const creadentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await Authservice.creadentialsLogin(req.body)

    setAuthCookie(res, result)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "User Loged in successfully",
        data: result
    })
})


export const AuthContoller = {
    creadentialsLogin
}