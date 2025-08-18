import { IRider, RiderRole } from "./rider.interface";
import { Rider } from "./rider.model";
import { envVars } from "../../config/env";
import bcrypt from 'bcryptjs'
import statusCode from "http-status-codes";
import AppError from "../../errorHandle/appError";

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

export const RiderService = {
    registetionRider,
    myProfile,
    getAllUsers
}