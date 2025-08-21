import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdZod = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createHistorySchema = z.object({
  rideId: objectIdZod,
  riderId: objectIdZod,
  driverId: objectIdZod,

  riderRating: z.number().min(1).max(5).optional(),
  riderFeedback: z.string().optional(),
  driverRating: z.number().min(1).max(5).optional(),
  driverFeedback: z.string().optional(),

  status: z.enum(['COMPLETED', 'CANCELLED', 'REJECTED']).optional(),
  completedAt: z.coerce.date().optional(),
})

export const riderFeedbackSchema = z.object({

  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  feedback: z.string().optional(),
})



export const driverFeedbackSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  feedback: z.string().optional(),
});


export const updateHistorySchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  riderRating: z.number().min(1).max(5).optional(),
  driverRating: z.number().min(1).max(5).optional(),
  riderFeedback: z.string().optional(),
  driverFeedback: z.string().optional(),
})