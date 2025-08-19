import { IRide, RideStatus } from './ride.interface';
import AppError from '../../errorHandle/appError';
import { Ride } from './ride.model';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { RiderRole } from '../rider/rider.interface';
import { calculateFare } from '../../utils/calculateFare';

export const createRide = async (payload: Partial<IRide>, decodedUser: JwtPayload) => {

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

export const RideService = {
    createRide
}