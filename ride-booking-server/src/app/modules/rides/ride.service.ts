import { IRide, RideStatus } from './ride.interface';
import AppError from '../../errorHandle/appError';
import { Ride } from './ride.model';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { RiderRole } from '../rider/rider.interface';
import { calculateFare } from '../../utils/calculateFare';
import { HistoryService } from '../history/history.service';
import { Types } from 'mongoose';

const createRide = async (payload: Partial<IRide>, decodedUser: JwtPayload) => {

    if (!decodedUser) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Your are unauthorized');
    }

    if (decodedUser.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'Your account is blocked');
    }

    if (decodedUser.role !== RiderRole.RIDER) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only riders can create rides');
    }

    if (!payload.rider) {
        throw new AppError(400, 'Rider information is required.');
    }

    const isRiderInRide = await Ride.findOne({
        rider: payload.rider,
        rideStatus: { $in: [RideStatus.Requested, RideStatus.Accepted] },
    });

    if (isRiderInRide?.rideStatus === RideStatus.Requested) {
        throw new AppError(400, 'You already requested for a ride and it is still pending.');
    } else if (isRiderInRide?.rideStatus === RideStatus.Accepted) {
        throw new AppError(400, 'You already accepted a ride and it is still pending.');
    }

    const { pickupLocation, destinationLocation } = payload;

    if (!pickupLocation || !destinationLocation) {
        throw new AppError(400, 'Pickup and destination locations are required.');
    }

    const distanceCalculate = calculateFare(
        pickupLocation.lat,
        pickupLocation.lng,
        destinationLocation.lat,
        destinationLocation.lng
    );

    const distance = `${distanceCalculate.toFixed(2)}km`;
    const fare = Math.ceil(distanceCalculate * 20);

    const newRide = await Ride.create({
        ...payload,
        distance,
        fare
    });

    return newRide;
}

const getAllRides = async (user: JwtPayload) => {
    const userId = user.riderId;
    const isRider = user.role === RiderRole.RIDER;

    const filter = isRider ? { rider: userId } : {};

    const [totalRides, rides] = await Promise.all([
        Ride.countDocuments(filter),
        Ride.find(filter)
        // .populate('driver', 'name email')
        // .sort({ createdAt: -1 })
    ]);

    return {
        data: rides,
        meta: {
            total: totalRides
        }
    };
};

const getSingleRide = async (rideId: string, user: JwtPayload) => {
    const ride = await Ride.findById(rideId)
    // .populate('driver', 'name email');

    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
    }

    if (user.role === RiderRole.RIDER && ride.rider.toString() !== user.riderId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to access this ride');
    }

    return ride;
};

const getAvailableRides = async () => {
    const availableRides = await Ride.find({ rideStatus: RideStatus.Requested })
    // .populate('rider', 'name email')
    // .sort({ createdAt: -1 });

    if (!availableRides) {
        throw new AppError(httpStatus.NOT_FOUND, 'There is no ride are available.');
    }

    return availableRides;
}

const updateRideStatus = async (
    user: JwtPayload,
    rideId: string,
    data: { status?: RideStatus; driver?: string }
) => {
    const { status, driver } = data;

    const update: any = {};
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
    }

    if (user.role === RiderRole.RIDER && ride.rider.toString() !== user.riderId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to update this ride');
    }

    if (status) {
        update.rideStatus = status;

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
    }

    if (driver) {
        update.driver = driver;
    }

    const updatedRide = await Ride.findByIdAndUpdate(rideId, update, {
        new: true,
    });

    if (status === RideStatus.Completed && updatedRide) {
        await HistoryService.createHistory({
            rideId: new Types.ObjectId(updatedRide._id),
            riderId: updatedRide.rider as any,
            driverId: updatedRide.driver as any,
            status: 'COMPLETED',
            completedAt: new Date(),
        });
    }

    return updatedRide;
}

const cancelRequestedRide = async (rideId: string, cancelledBy: 'RIDER' | 'DRIVER' | 'ADMIN', userId: string) => {
    const ride = await Ride.findById(rideId);

    if (!ride) throw new Error('Ride not found');

    if (ride.rideStatus === RideStatus.Completed ||
        ride.rideStatus === RideStatus.CancelledByRider ||
        ride.rideStatus === RideStatus.CancelledByDriver ||
        ride.rideStatus === RideStatus.PickedUp ||
        ride.rideStatus === RideStatus.InTransit) {
        throw new AppError(401, `This ride already ${ride.rideStatus}. You can't cancel it.`);
    }

    if (
        (cancelledBy === 'RIDER' && ride.rider.toString() !== userId) ||
        (cancelledBy === 'DRIVER' && ride.driver?.toString() !== userId)
    ) {
        throw new Error('Unauthorized cancellation');
    }

    const status = cancelledBy === 'RIDER' ? RideStatus.CancelledByRider : RideStatus.CancelledByDriver;
    console.log('cancelled status', cancelledBy)

    ride.rideStatus = status;
    ride.cancelledBy = cancelledBy;
    if (!ride.rideTimeline) {
        ride.rideTimeline = {};
    }
    ride.rideTimeline.cancelledAt = new Date();

    await ride.save();

    return ride;
}


export const RideService = {
    createRide,
    getAllRides,
    getSingleRide,
    getAvailableRides,
    updateRideStatus,
    cancelRequestedRide
}