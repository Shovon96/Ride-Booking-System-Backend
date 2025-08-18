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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await RiderService.getAllUsers()

    sendResponse(res, {
        success: true,
        statusCode: statusCode.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await RiderService.getSingleUser(id)

    sendResponse(res, {
        success: true,
        statusCode: statusCode.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    const decodedToken = req.user
    const user = await RiderService.updateUser(userId, payload, decodedToken as JwtPayload)

    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "User Updated Successfully!!",
        data: user,
    })
})

const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user
    const user = await RiderService.deleteUser(userId, decodedToken as JwtPayload)

    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "User deleted Successfully!!",
        data: null
    })
})


export const RiderController = {
    registetionRider,
    myProfile,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}