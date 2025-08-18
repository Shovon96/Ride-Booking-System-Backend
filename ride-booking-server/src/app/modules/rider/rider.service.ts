import { ActiveStatus, IRider, RiderRole } from "./rider.interface";
import { Rider } from "./rider.model";
import { envVars } from "../../config/env";
import bcrypt from 'bcryptjs'
import statusCode from "http-status-codes";
import AppError from "../../errorHandle/appError";
import { JwtPayload } from "jsonwebtoken";

const registetionRider = async (payload: Partial<IRider>) => {
    const { email, password, role, ...rest } = payload;

    const isRiderExist = await Rider.findOne({ email })

    if (isRiderExist) {
        throw new AppError(statusCode.BAD_REQUEST, "This Rider Already Exist")
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

const getAllUsers = async () => {
    const users = await Rider.find({});
    const totalUsers = await Rider.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};

const getSingleUser = async (id: string) => {
    const user = await Rider.findById(id).select("-password")
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


export const RiderService = {
    registetionRider,
    myProfile,
    getAllUsers,
    getSingleUser,
    updateUser
}