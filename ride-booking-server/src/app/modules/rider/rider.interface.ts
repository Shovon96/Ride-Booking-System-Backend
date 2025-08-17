import { Types } from "mongoose";

export enum RiderRole {
    ADMIN = "ADMIN",
    RIDER = "RIDER",
    DRIVER = "DRIVER"
}

export enum ActiveStatus {
    ACTIVE = "ACTIVE",
    OFFLINE = "OFFLINE",
    SUSPENDED = "SUSPENDED"
}

export enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED"
}

export interface VehicleInfo {
    license: string;
    model: string;
    plateNumber: string;
}

export interface IRider {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    role: RiderRole;
    isBlocked?: boolean;
    isVerified?: boolean;
    createdAt?: Date;

    // Driver-specific fields
    isAvailable?: ActiveStatus;
    approvalStatus?: ApprovalStatus;
    vehicleInfo?: VehicleInfo;
}
