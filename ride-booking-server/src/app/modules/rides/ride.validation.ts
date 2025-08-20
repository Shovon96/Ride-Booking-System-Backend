import { z } from 'zod';
import { RideStatus } from './ride.interface';

export const createRideSchema = z.object({
    rider: z.string(),
    pickupLocation: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        address: z.string().optional(),
    }),
    destinationLocation: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        address: z.string().optional(),
    })
});


const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = z.string().regex(objectIdRegex, 'Invalid ObjectId format');

export const updateRideSchema = z.object({
    status: z.enum(Object.values(RideStatus) as [string]).optional(),
    driver: objectId.optional(),
});


export const updateRideStatusSchema = z.object({
    status: z.enum([
        'accepted',
        'picked_up',
        'in_transit',
        'completed',
        'cancelled_by_rider',
        'cancelled_by_driver',
    ]),
})