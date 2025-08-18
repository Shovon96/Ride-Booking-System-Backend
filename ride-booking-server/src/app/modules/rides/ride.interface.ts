import { Types } from "mongoose";

export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PIC_UP = "PICK_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
    CASH = "CASH",
    BKASH = "BKASH",
    NAGAD = "NAGAD",
    CARD = "CARD",
}

export enum paymentStatus {
    UNPAID = "UNPAID",
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
}

export interface IRide {
    _id?: string;
    rider: Types.ObjectId;
    driver?: Types.ObjectId;
    pickupLocation: string;
    dropoffLocation: string;
    fare: number;
    distance?: string;
    estimatedTime?: string;
    rideStatus?: RideStatus;
    paymentMethod: PaymentMethod;
    paymentStatus?: paymentStatus;
    isPaid?: boolean;
    startTime?: Date;
    endTime?: Date;
    createdAt?: Date;
}