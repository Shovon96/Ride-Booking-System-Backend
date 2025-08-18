import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { RiderRole } from '../rider/rider.interface';
import { RideService } from './ride.service';

export const RideController = {
    createRide: catchAsync(async (req: Request, res: Response) => {
        const decodedUser = req.user as { role: string, riderId: string };
        if (!decodedUser) {
            return sendResponse(res, {
                statusCode: httpStatus.UNAUTHORIZED,
                success: false,
                message: 'Unauthorized',
                data: decodedUser
            });
        }
        if (decodedUser.role !== RiderRole.RIDER) {
            return sendResponse(res, {
                statusCode: httpStatus.FORBIDDEN,
                success: false,
                message: 'Only riders can create rides',
                data: decodedUser
            });
        }
        if (req.body.isBlocked) {
            return sendResponse(res, {
                statusCode: httpStatus.FORBIDDEN,
                success: false,
                message: 'Your account is blocked',
                data: decodedUser
            });
        }
        const result = await RideService.createRide({ ...req.body, rider: decodedUser.riderId });
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Ride created successfully!',
            data: result,
        });
    }),
};