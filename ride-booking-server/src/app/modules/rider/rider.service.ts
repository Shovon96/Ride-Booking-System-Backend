import { ActiveStatus, IRider, RiderRole } from "./rider.interface";
import { Rider } from "./rider.model";
import { envVars } from "../../config/env";
import bcrypt from 'bcryptjs'
import statusCode from "http-status-codes";
import AppError from "../../errorHandle/appError";
import { JwtPayload } from "jsonwebtoken";
import { Ride } from "../rides/ride.model";

const registetionRider = async (payload: Partial<IRider>) => {
    const { email, password, role, ...rest } = payload;

    const isRiderExist = await Rider.findOne({ email })

    if (isRiderExist) {
        throw new AppError(statusCode.BAD_REQUEST, "This Rider Already Exist")
    }

    if (payload.role === RiderRole.DRIVER) {
        if (!payload?.vehicleInfo) {
            throw new AppError(statusCode.BAD_REQUEST, "Vehicle details are required for drivers")
        }
    }

    if (payload.role === RiderRole.RIDER) {
        if (payload?.vehicleInfo) {
            throw new AppError(statusCode.BAD_REQUEST, "Vehicle details do not need for riders")
        }
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const rider = await Rider.create({
        email,
        password: hashedPassword,
        role,
        ...rest
    })

    return rider

}

const myProfile = async (userId: string) => {
    const user = await Rider.findById(userId).select("-password")
    if (!user) {
        throw new AppError(401, "This user does not exist!")
    }
    return { data: user }
}

const getAllRiders = async () => {
    const users = await Rider.find({});
    const filteredRiders = users.filter(user => user.role === RiderRole.RIDER);
    const totalRiders = await Rider.countDocuments({ role: RiderRole.RIDER });
    return {
        data: filteredRiders,
        meta: {
            total: totalRiders
        }
    }
};

const getSingleRider = async (id: string) => {
    const user = await Rider.findById(id).select("-password")
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "This rider does not exist!")
    }
    if (user.role !== RiderRole.RIDER) {
        throw new AppError(statusCode.BAD_REQUEST, "This is not a valid rider")
    }
    return { data: user }
}

const updateUser = async (userId: string, payload: Partial<IRider>, decodedToken: JwtPayload) => {

    if (decodedToken.role === RiderRole.RIDER || decodedToken.role === RiderRole.DRIVER) {
        if (userId !== decodedToken.riderId) {
            throw new AppError(statusCode.UNAUTHORIZED, "You are not authorized")
        }
    }

    const isUserExist = await Rider.findById(userId);

    if (!isUserExist) {
        throw new AppError(statusCode.NOT_FOUND, "This user not found")
    }

    if (payload.role) {
        if (decodedToken.role === RiderRole.RIDER || decodedToken.role === RiderRole.DRIVER) {
            throw new AppError(statusCode.FORBIDDEN, "You are not authorized for update")
        }
    }

    if (payload.isBlocked || payload.isVerified || payload.isAvailable === ActiveStatus.SUSPENDED) {
        if (decodedToken.role === RiderRole.RIDER || decodedToken.role === RiderRole.DRIVER) {
            throw new AppError(statusCode.FORBIDDEN, "You are not authorized for update")
        }
    }

    const newUpdatedUser = await Rider.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select("-password")

    return newUpdatedUser;
}

const deleteUser = async (userId: string, decodedToken: JwtPayload) => {

    if (decodedToken.role === RiderRole.RIDER || decodedToken.role === RiderRole.DRIVER) {
        if (userId !== decodedToken.riderId) {
            throw new AppError(statusCode.UNAUTHORIZED, "You are not valid user")
        }
    }

    const deleteUser = await Rider.findByIdAndDelete(userId)

    return deleteUser;
}

const getSummary = async () => {
    const totalRides = await Ride.countDocuments();

    const totalCompletedRides = await Ride.countDocuments({ status: 'completed' });

    const totalCancelledRides = await Ride.countDocuments({
        status: { $in: ['cancelled_by_rider', 'cancelled_by_driver'] },
    });

    const riderCancelledCount = await Ride.countDocuments({ status: 'cancelled_by_rider' });
    const driverCancelledCount = await Ride.countDocuments({ status: 'cancelled_by_driver' });
    const adminCancelledCount = await Ride.countDocuments({ cancelledBy: 'admin' });

    const cancellationTotal = riderCancelledCount + driverCancelledCount + adminCancelledCount;

    const getPercentage = (count: number) =>
        cancellationTotal > 0 ? ((count / cancellationTotal) * 100).toFixed(2) + '%' : '0%';

    // ✅ Get users by role
    const totalRiders = await Rider.countDocuments({ role: 'rider' });
    const totalDrivers = await Rider.countDocuments({ role: 'driver' });

    return {
        totalRides,
        totalCompletedRides,
        totalCancelledRides,
        totalRiders,
        totalDrivers,
        cancellations: {
            rider: {
                count: riderCancelledCount,
                percentage: getPercentage(riderCancelledCount),
            },
            driver: {
                count: driverCancelledCount,
                percentage: getPercentage(driverCancelledCount),
            },
            admin: {
                count: adminCancelledCount,
                percentage: getPercentage(adminCancelledCount),
            },
        },
    };
}


export const RiderService = {
    registetionRider,
    myProfile,
    getAllRiders,
    getSingleRider,
    updateUser,
    deleteUser,
    getSummary
}