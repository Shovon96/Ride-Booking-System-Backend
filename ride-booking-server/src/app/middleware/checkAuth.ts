import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import AppError from "../errorHandle/appError";
import statusCode from 'http-status-codes'
import { Rider } from "../modules/rider/rider.model";
import { JwtPayload } from "jsonwebtoken";
import { ActiveStatus, ApprovalStatus } from "../modules/rider/rider.interface";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_TOKEN) as JwtPayload

        const isUserExist = await Rider.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(statusCode.BAD_REQUEST, "User does not exist")
        }
        if (isUserExist.isAvailable === ActiveStatus.SUSPENDED || isUserExist.isAvailable === ActiveStatus.OFFLINE) {
            throw new AppError(statusCode.BAD_REQUEST, `User is ${isUserExist.isAvailable}`)
        }
        if (isUserExist.approvalStatus === ApprovalStatus.SUSPENDED) {
            throw new AppError(statusCode.BAD_REQUEST, "Thsi User is Suspended")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }
        req.user = verifiedToken
        next()

    } catch (error) {
        console.log("jwt error", error);
        next(error)
    }
}