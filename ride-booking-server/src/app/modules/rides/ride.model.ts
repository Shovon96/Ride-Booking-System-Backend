

import { Schema, model } from 'mongoose';
import { IRide } from './ride.interface';



export const calculateFare = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;

    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
};

const rideSchema = new Schema<IRide>(
    {
        rider: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        status: {
            type: String,
            enum: [
                'requested',
                'accepted',
                'picked_up',
                'in_transit',
                'completed',
                'cancelled_by_rider',
                'cancelled_by_driver',
            ],
            default: 'requested',
        },

        pickupLocation: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            address: { type: String },
        },

        destinationLocation: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            address: { type: String },
        },

        fare: {
            type: Number,
            default: 0,
        },

        cancelledBy: {
            type: String,
            enum: ['rider', 'driver', 'admin'],
        },

        rideTimeline: {
            requestedAt: { type: Date, default: Date.now },
            acceptedAt: Date,
            pickedUpAt: Date,
            completedAt: Date,
            cancelledAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const Ride = model<IRide>('Ride', rideSchema);



rideSchema.pre('save', function (next) {
    if (!this.isModified('pickupLocation') || !this.isModified('destinationLocation')) {
        return next();
    }

    const pickup = this.pickupLocation;
    const destination = this.destinationLocation;

    const distance = calculateFare(
        pickup.lat,
        pickup.lng,
        destination.lat,
        destination.lng
    );

    console.log(`Calculated distance: ${distance} km`);
    this.fare = Math.ceil(distance * 20);

    next();
});