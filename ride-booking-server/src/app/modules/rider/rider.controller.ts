import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes"
import { RiderService } from "./rider.service";
import { createRiderTokens } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";

const registetionRider = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rider = await RiderService.registetionRider(req.body);
    // set cookie
    const tokens = createRiderTokens(rider);
    setAuthCookie(res, tokens);

    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "Rider Created Successfully",
        data: rider,
    })
})

const myProfile = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const result = await RiderService.myProfile(decodedToken.riderId)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.CREATED,
        message: "My Profile Retrieved Successfully",
        data: result.data
    })
})


export const RiderController = {
    registetionRider,
    myProfile
}