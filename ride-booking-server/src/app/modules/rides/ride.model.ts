import { Schema, model } from "mongoose";
import { IRide, PaymentMethod, paymentStatus, RideStatus } from "./ride.interface";

const rideSchema = new Schema<IRide>({
    rider: {
        type: Schema.Types.ObjectId,
        ref: "Rider",
        required: true,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true,
        trim: true,
    },
    dropoffLocation: {
        type: String,
        required: true,
        trim: true,
    },
    fare: {
        type: Number,
        required: true,
        min: 0,
    },
    distance: {
        type: String,
        min: 0,
    },
    rideStatus: {
        type: String,
        enum: Object.values(RideStatus),
        default: "REQUESTED",
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(paymentStatus),
        default: "UNPAID",
    },
    isPaid: { type: Boolean },
    startTime: { type: Date },
    endTime: { type: Date }
}, {
    timestamps: true,
    versionKey: false
}
);

export const Ride = model<IRide>("Ride", rideSchema);
