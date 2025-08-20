import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { DriverService } from "./driver.service";

const acceptRideByDriver = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const { riderId } = req.user as JwtPayload;
    const result = await DriverService.acceptRideByDriver(rideId, riderId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Ride accepted successfully!',
        data: result,
    })
})

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = req.body.status;
    const result = await DriverService.updateRideStatus(id, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Ride status updated to ${status}`,
        data: result,
    });
})


export const DriverController = {
    acceptRideByDriver,
    updateRideStatus
}