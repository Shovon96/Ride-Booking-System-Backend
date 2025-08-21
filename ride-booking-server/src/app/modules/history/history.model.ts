import { Schema, model } from 'mongoose';

const HistorySchema = new Schema(
  {
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    riderId: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },

    riderRating: { type: Number, min: 1, max: 5, default: null },
    riderFeedback: { type: String, default: '' },
    driverRating: { type: Number, min: 1, max: 5, default: null },
    driverFeedback: { type: String, default: '' },

    fare: { type: Number },
    status: {
      type: String,
      enum: ['COMPLETED', 'CANCELLED', 'REJECTED'],
      default: 'COMPLETED',
    },
    completedAt: { type: Date }
  },
  { timestamps: true, versionKey: false }
);



export const History = model('History', HistorySchema);