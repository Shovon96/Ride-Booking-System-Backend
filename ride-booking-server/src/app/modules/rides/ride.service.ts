import { IRide, RideStatus } from './ride.interface';
import AppError from '../../errorHandle/appError';
import { calculateFare, Ride } from './ride.model';

export const RideService = {
    createRide: async (payload: Partial<IRide>) => {

        if (!payload.rider) {
            throw new AppError(400, 'Rider information is required.');
        }

        const isRiderInRide = await Ride.findOne({
            rider: payload.rider,
            status: { $in: [RideStatus.Requested, RideStatus.Accepted] },
        });
        if (isRiderInRide?.status === RideStatus.Requested) {
            throw new AppError(400, 'You already requested for a ride and it is still pending.');
        } else if (isRiderInRide?.status === RideStatus.Accepted) {
            throw new AppError(400, 'You already accepted a ride and it is still pending.');
        }

        const { pickupLocation, destinationLocation } = payload;

        if (!pickupLocation || !destinationLocation) {
            throw new AppError(400, 'Pickup and destination locations are required.');
        }

        const distance = calculateFare(
            pickupLocation.lat,
            pickupLocation.lng,
            destinationLocation.lat,
            destinationLocation.lng
        );

        const fare = Math.ceil(distance * 20);

        const newRide = await Ride.create({
            ...payload,
            fare,
        });

        return newRide;
    },
}