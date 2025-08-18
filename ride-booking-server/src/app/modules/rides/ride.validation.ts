import { z } from "zod";
import mongoose from "mongoose";
import { PaymentMethod, paymentStatus, RideStatus } from "./ride.interface";

export const rideValidationZodSchema = z.object({
    rider: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Rider ID",
    }),
    driver: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Driver ID",
    }),
    pickupLocation: z.string(),
    dropoffLocation: z.string(),
    fare: z.number().min(0, "Fare must be a positive number"),
    distance: z.number().min(0, "Distance must be a positive number").optional(),
    riderStatus: z.enum(Object.values(RideStatus) as [string]).optional(),
    paymentMethod: z.enum(Object.values(PaymentMethod) as [string]),
    paymentStatus: z.enum(Object.values(paymentStatus) as [string]).optional(),
    isPaid: z.boolean().optional(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
});
