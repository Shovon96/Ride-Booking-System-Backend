import { Types } from 'mongoose';

export interface ILocation {
    lat: number;
    lng: number;
    address?: string;
}

export enum RideStatus {
    Requested = 'requested',
    Accepted = 'accepted',
    PickedUp = 'picked_up',
    InTransit = 'in_transit',
    Completed = 'completed',
    CancelledByRider = 'cancelled_by_rider',
    CancelledByDriver = 'cancelled_by_driver',
}

export interface IRideTimeline {
    requestedAt?: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
}

export interface IRide {
    _id?: string;
    rider: Types.ObjectId;
    driver?: Types.ObjectId | null;
    rideStatus: RideStatus;
    pickupLocation: ILocation;
    destinationLocation: ILocation;
    distance?: string;
    fare?: number;
    cancelledBy?: 'RIDER' | 'DRIVER' | 'ADMIN';
    rideTimeline?: IRideTimeline;

    createdAt?: Date;
    updatedAt?: Date;
}