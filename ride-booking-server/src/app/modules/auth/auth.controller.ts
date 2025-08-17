import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { setAuthCookie } from "../../utils/setCookie"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from 'http-status-codes'
import { AuthService } from "./auth.service"
import AppError from "../../errorHandle/appError"
import { JwtPayload } from "jsonwebtoken"
import { createRiderTokens } from "../../utils/userToken"
import { envVars } from "../../config/env"

const creadentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.creadentialsLogin(req.body)

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

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken)

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.ACCEPTED,
        message: "New access token retrived  Successfully",
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: statusCode.ACCEPTED,
        message: "User logout Successfully",
        data: null,
    })
})

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthService.changePassword(newPassword, oldPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "Password Changed Successfully!",
        data: null,
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user;

    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createRiderTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthController = {
    creadentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    googleCallbackController
}