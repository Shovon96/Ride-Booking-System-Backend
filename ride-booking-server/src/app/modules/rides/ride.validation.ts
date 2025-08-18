import { z } from 'zod';

export const createRideSchema = z.object({
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