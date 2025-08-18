import { model, Schema } from "mongoose";
import { ActiveStatus, ApprovalStatus, IRider, RiderRole, VehicleInfo } from "./rider.interface";


const vehicleInfoSchema = new Schema<VehicleInfo>({
    license: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, required: true },
});


const riderSchema = new Schema<IRider>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: Object.values(RiderRole),
        default: RiderRole.RIDER
    },
    phone: {
        type: String
    },
    isBlocked: {
        type: Boolean
    },
    isVerified: { type: Boolean },
    createdAt: {
        type: Date
    },

    // driver??
    isAvailable: {
        type: String,
        enum: Object.values(ActiveStatus),
        default: ActiveStatus.ACTIVE
    },
    approvalStatus: {
        type: String,
        enum: Object.values(ApprovalStatus)
    },
    vehicleInfo: {
        type: vehicleInfoSchema,
        // required: function () {
        //     return this.role === RiderRole.DRIVER;
        // },
    }

}, {
    timestamps: true,
    versionKey: false
})


export const Rider = model<IRider>("Rider", riderSchema)