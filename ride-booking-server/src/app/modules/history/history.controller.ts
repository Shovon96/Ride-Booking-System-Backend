import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { HistoryService } from './history.service';
import { sendResponse } from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';


const getAllHistories = catchAsync(async (req: Request, res: Response) => {
    const result = await HistoryService.getAllHistories();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Histories retrieved successfully',
        data: result,
    });
})

const getSingleHistory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HistoryService.getSingleHistory(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'History retrieved successfully',
        data: result,
    });
})

const updateHistory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const result = await HistoryService.updateHistory(id, data);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'History updated successfully',
        data: result,
    });
})

const deleteHistory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await HistoryService.deleteHistory(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'History deleted successfully',
        data: result,
    });
})


const updateRiderFeedback = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const { riderId } = req.user as JwtPayload;
    const updated = await HistoryService.updateRiderFeedback(rideId, req.body, riderId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Rider feedback submitted',
        data: updated,
    });
})

const updateDriverFeedback = catchAsync(async (req: Request, res: Response) => {
    const { driveId } = req.params;
    const { driverId } = req.user as JwtPayload;
    const updated = await HistoryService.updateDriverFeedback(driveId, req.body, driverId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Driver feedback submitted',
        data: updated,
    });
})

export const HistoryController = {
    getAllHistories,
    getSingleHistory,
    updateHistory,
    deleteHistory,
    updateRiderFeedback,
    updateDriverFeedback
};