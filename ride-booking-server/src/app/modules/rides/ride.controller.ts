import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { RideService } from './ride.service';
import { JwtPayload } from 'jsonwebtoken';

const createRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedUser = req.user;
    const payload = req.body;
    const result = await RideService.createRide(payload, decodedUser as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Ride created successfully!',
        data: result,
    });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
    const decodedUser = req.user;
    const result = await RideService.getAllRides(decodedUser as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All rides fetched successfully!',
        data: result,
    });
});

export const RideController = {
    createRide,
    getAllRides
};