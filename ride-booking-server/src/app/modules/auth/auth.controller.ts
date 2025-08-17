import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { setAuthCookie } from "../../utils/setCookie"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from 'http-status-codes'
import { Authservice } from "./auth.service"
import AppError from "../../errorHandle/appError"

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

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(statusCode.BAD_REQUEST, "No token recived from cookies")
    }

    const tokenInfo = await Authservice.getNewAccessToken(refreshToken)

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.ACCEPTED,
        message: "New access token retrived  Successfully",
        data: tokenInfo,
    })
})

const logout=catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
  
    res.clearCookie("accessToken",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })

     sendResponse(res, {
        success: true,
        statusCode: statusCode.ACCEPTED,
        message: "User logout   Successfully",
        data: null,
    })
})


export const AuthContoller = {
    creadentialsLogin,
    getNewAccessToken,
    logout
}