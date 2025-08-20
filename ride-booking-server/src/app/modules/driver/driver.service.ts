import { Types } from "mongoose";
import AppError from "../../errorHandle/appError";
import { ApprovalStatus, RiderRole } from "../rider/rider.interface";
import { Rider } from "../rider/rider.model";
import { Ride } from "../rides/ride.model";
import { RideStatus } from "../rides/ride.interface";

const acceptRideByDriver = async (rideId: string, driverId: string) => {
    const isDriverExist = await Rider.findById(driverId);
    if (
        !isDriverExist ||
        isDriverExist.role !== RiderRole.DRIVER ||
        !isDriverExist.isBlocked ||
        isDriverExist.approvalStatus !== ApprovalStatus.APPROVED
    ) {
        throw new AppError(403, 'Invalid this driver');
    }

    const isDriving = await Ride.findOne({
        driver: new Types.ObjectId(driverId),
        rideStatus: { $in: [RideStatus.Accepted, RideStatus.PickedUp, RideStatus.InTransit] },
    });
    if (isDriving) {
        throw new AppError(400, 'You are already driving another ride.');
    }

    const updateRide = await Ride.findOneAndUpdate(
        { _id: rideId, rideStatus: RideStatus.Requested },
        {
            driver: driverId,
            rideStatus: RideStatus.Accepted,
            'rideTimeline.acceptedAt': new Date(),
        },
        { new: true }
    )
    if (!updateRide) {
        throw new AppError(404, 'Ride not found or already accepted.');
    }
    return updateRide;
}


export const DriverService = {
    acceptRideByDriver
}