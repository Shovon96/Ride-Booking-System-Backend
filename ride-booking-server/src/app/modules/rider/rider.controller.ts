import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes"

const registetionRider = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rider = await RiderServices.registetionRider(req.body);
    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "Rider Created Successfully",
        data: rider,
    })
})


export const RiderController = {
    registetionRider
}