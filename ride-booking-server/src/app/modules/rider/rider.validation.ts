import z from "zod";
import { ActiveStatus, ApprovalStatus, RiderRole } from "./rider.interface";

export const vehicleInfoSchema = z.object({
    license: z.string()
        .min(3, { message: "License must be at least 3 characters long" }),
    model: z.string(),
    plateNumber: z.string()
        .min(3, { message: "Plate number must be at least 3 characters long" })
});

export const createRiderZodSchema = z.object({
    name: z.string()
        .min(2, { message: "Name is required must at least 2 character" })
        .max(40, { message: "Name is maximum 40 character" }),
    email: z.string()
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email is required must at least 5 character" })
        .max(40, { message: "Email is maximum 40 character" }),
    password: z.string()
        .min(6, { message: "Password must be 6 character" })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        })
        .optional(),
    role: z.enum(Object.values(RiderRole) as [string])
        .transform((val) => val.toUpperCase())
        .optional(),
    phone: z.string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

    // Driver-specific fields
    vehicleInfo: vehicleInfoSchema.optional(),
    isAvailable: z.enum(Object.values(ActiveStatus) as [string])
        .transform((val) => val.toUpperCase())
        .optional(),
    approvalStatus: z.enum(Object.values(ApprovalStatus) as [string])
        .transform((val) => val.toUpperCase())
        .optional(),
});


export const updateRiderZodSchema = z.object({
    name: z.string()
        .min(2, { message: "Name is required must at least 2 character" })
        .max(40, { message: "Name is maximum 40 character" })
        .optional(),
    role: z.enum(Object.values(RiderRole) as [string])
        .transform((val) => val.toUpperCase())
        .optional(),
    phone: z.string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

    // Driver-specific fields
    vehicleInfo: vehicleInfoSchema.optional(),
    isAvailable: z.enum(Object.values(ActiveStatus) as [string])
        .transform((val) => val.toUpperCase())
        .optional(),
    approvalStatus: z.enum(Object.values(ApprovalStatus) as [string])
        .transform((val) => val.toUpperCase())
        .optional(),
});
