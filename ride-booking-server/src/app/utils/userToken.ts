import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { ActiveStatus, ApprovalStatus, IRider } from "../modules/rider/rider.interface";
import { generateToken, verifyToken } from "./jwt";
import { Rider } from "../modules/rider/rider.model";
import AppError from "../errorHandle/appError";

export const createRiderTokens = (rider: Partial<IRider>) => {
    const jwtPayload = {
        riderId: rider._id,
        email: rider.email,
        role: rider.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN, envVars.JWT_TOKEN_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_TOKEN, envVars.JWT_REFRESH_EXPIRES)


    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN) as JwtPayload


    const isRiderExist = await Rider.findOne({ email: verifiedRefreshToken.email })

    if (!isRiderExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Rider does not exist")
    }

    if (isRiderExist.isAvailable === ActiveStatus.SUSPENDED || isRiderExist.isAvailable === ActiveStatus.OFFLINE) {
        throw new AppError(httpStatus.BAD_REQUEST, `Rider is ${isRiderExist.isAvailable}`)
    }
    if (isRiderExist.approvalStatus === ApprovalStatus.SUSPENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Thsi Rider is Suspended")
    }

    const jwtPayload = {
        riderId: isRiderExist._id,
        email: isRiderExist.email,
        role: isRiderExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN, envVars.JWT_TOKEN_EXPIRES)

    return accessToken
}