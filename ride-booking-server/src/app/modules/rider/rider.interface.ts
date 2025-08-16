
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
    name: string;
    email: string;
    password?: string;
    role: RiderRole;
    isBlocked?: boolean;
    createdAt?: Date;

    // Driver-specific fields
    isAvailable?: ActiveStatus;
    approvalStatus?: ApprovalStatus;
    vehicleInfo?: VehicleInfo;
}
