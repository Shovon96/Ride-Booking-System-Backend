import AppError from "../../errorHandle/appError";
import { IHistory } from "./history.interface";
import { History } from "./history.model";


const createHistory = async (payload: IHistory): Promise<IHistory> => {
    const history = await History.create(payload);
    return history;
}

const getAllHistories = async (): Promise<IHistory[]> => {
    return History.find().populate("rideId riderId driverId");
}

const getSingleHistory = async (id: string): Promise<IHistory | null> => {
    return History.findById(id).populate("rideId riderId driverId");
}

const updateHistory = async (
    id: string,
    payload: Partial<IHistory>
): Promise<IHistory | null> => {
    return History.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
}

const deleteHistory = async (id: string): Promise<IHistory | null> => {
    return History.findByIdAndDelete(id);
}

const updateRiderFeedback = async (
    historyId: string,
    data: { rating: number; feedback?: string },
    userId: string
): Promise<IHistory | null> => {
    const history = await History.findById(historyId);
    if (!history) {
        throw new AppError(404, 'History not found');
    }

    if (history.riderId.toString() !== userId) {
        throw new AppError(401, 'Unauthorized');
    }

    return History.findByIdAndUpdate(
        historyId,
        {
            riderRating: data.rating,
            riderFeedback: data.feedback,
        },
        { new: true }
    );
}

const updateDriverFeedback = async (
    historyId: string,
    data: { rating: number; feedback?: string },
    userId: string
): Promise<IHistory | null> => {
    const history = await History.findById(historyId);
    if (!history) {
        throw new AppError(404, 'History not found');
    }

    if (history.driverId?.toString() !== userId) {
        throw new AppError(401, 'Unauthorized');
    }

    return History.findByIdAndUpdate(
        historyId,
        {
            driverRating: data.rating,
            driverFeedback: data.feedback,
        },
        { new: true }
    );
}

export const HistoryService = {
    createHistory,
    getAllHistories,
    getSingleHistory,
    updateHistory,
    deleteHistory,
    updateRiderFeedback,
    updateDriverFeedback
};