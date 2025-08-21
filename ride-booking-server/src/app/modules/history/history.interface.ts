import { Types } from 'mongoose';


export interface IHistory {
  rideId: Types.ObjectId;
  riderId: Types.ObjectId;
  driverId: Types.ObjectId;

  riderRating?: number;
  riderFeedback?: string;
  driverRating?: number;
  driverFeedback?: string;

  fare?: number;
  status?: 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  completedAt?: Date | null;
}