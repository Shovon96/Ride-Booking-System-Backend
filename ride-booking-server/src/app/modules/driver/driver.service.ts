import { Types } from "mongoose";
import AppError from "../../errorHandle/appError";
import { ApprovalStatus, RiderRole } from "../rider/rider.interface";
import { Rider } from "../rider/rider.model";
import { Ride } from "../rides/ride.model";
import { RideStatus } from "../rides/ride.interface";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from 'http-status-codes';
import { HistoryService } from "../history/history.service";
import { History } from "../history/history.model";

const getAllDrivers = async () => {
    const users = await Rider.find({});
    const filteredDrivers = users.filter(user => user.role === RiderRole.DRIVER);
    const totalDrivers = await Rider.countDocuments({ role: RiderRole.DRIVER });
    return {
        data: filteredDrivers,
        meta: {
            total: totalDrivers
        }
    }
};

const getSingleDriver = async (id: string) => {
    const user = await Rider.findById(id).select("-password")

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver does not exist!")
    }
    if (user.role !== RiderRole.DRIVER) {
        throw new AppError(httpStatus.BAD_REQUEST, "This is not a valid driver")
    }
    return { data: user }
}


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

const updateRideStatus = async (rideId: string, status: RideStatus) => {
    const update: any = { status };

    const statusTimeMap: Record<string, string> = {
        [RideStatus.Accepted]: 'acceptedAt',
        [RideStatus.PickedUp]: 'pickedUpAt',
        [RideStatus.Completed]: 'completedAt',
        [RideStatus.CancelledByDriver]: 'cancelledAt',
        [RideStatus.CancelledByRider]: 'cancelledAt',
    };

    const timelineKey = statusTimeMap[status];
    if (timelineKey) {
        update[`rideTimeline.${timelineKey}`] = new Date();
    }

    const updatedRide = await Ride.findByIdAndUpdate(rideId, { rideStatus: status, ...update }, {
        new: true,
    });

    if (status === RideStatus.Completed && updatedRide) {
        await HistoryService.createHistory({
            rideId: new Types.ObjectId(updatedRide._id),
            riderId: updatedRide.rider as any,
            driverId: updatedRide.driver as any,
            fare: updatedRide.fare,
            status: 'COMPLETED',
            completedAt: new Date(),
        });
    }

    return updatedRide;
}

const rejectRide = async (rideId: string, decodedToken: JwtPayload) => {
    const ride = await Ride.findById(rideId)
    const driverId = decodedToken.riderId

    const isDriverExists = await Rider.findById(driverId)

    if (!ride) {
        throw new AppError(httpStatus.BAD_REQUEST, "This ride is not exits")
    }
    if (!isDriverExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "This driver is not exits")
    }


    ride.rideStatus = RideStatus.CancelledByDriver;
    ride.driver = isDriverExists._id;

    await ride.save();
    await isDriverExists.save();


    return {
        ride,
    }

}

const getDriverTotalEarnings = async (driverId: string) => {
    const histories = await History.find({ driverId, status: "COMPLETED" }).sort({ completedAt: -1 });
    const totalEarnings = histories.reduce((acc, h) => acc + (h.fare || 0), 0);

    return {
        totalEarnings,
        totalRides: histories.length,
        histories,
    };
};

export const DriverService = {
    acceptRideByDriver,
    updateRideStatus,
    rejectRide,
    getAllDrivers,
    getSingleDriver,
    getDriverTotalEarnings
}