import { Schema, model } from 'mongoose';
import { IRide, RideStatus } from './ride.interface';
import { calculateFare } from '../../utils/calculateFare';


const rideSchema = new Schema<IRide>(
    {
        rider: {
            type: Schema.Types.ObjectId,
            ref: 'Rider',
            required: true,
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'Driver',
            default: null,
        },

        rideStatus: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.Requested,
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
        distance: {
            type: String
        },
        fare: {
            type: Number,
            default: 0,
        },

        cancelledBy: {
            type: String,
            enum: ['RIDER', 'DRIVER', 'ADMIN'],
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
        versionKey: false,
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