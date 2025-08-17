import AppError from "../../errorHandle/appError"
import { IRider } from "../rider/rider.interface"
import { Rider } from "../rider/rider.model"
import statusCode from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { createNewAccessTokenWithRefreshToken, createRiderTokens } from "../../utils/userToken"

const creadentialsLogin = async (payload: Partial<IRider>) => {
    const { email, password } = payload
    const isRiderExist = await Rider.findOne({ email })

    if (!isRiderExist) {
        throw new AppError(statusCode.BAD_REQUEST, "This user does not exits with this email!")
    }
    const isPasswordMatch = await bcrypt.compare(password as string, isRiderExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(statusCode.BAD_REQUEST, "Password does not exits!")
    }

    const userToken = createRiderTokens(isRiderExist)

    const { password: pass, ...rest } = isRiderExist.toObject()

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }

}

const getNewAccessToken=async(refreshToken:string)=>{
    
   const newAccessToken=await createNewAccessTokenWithRefreshToken(refreshToken)
   return {
    accessToken:newAccessToken
   }
} 

export const Authservice = {
    creadentialsLogin,
    getNewAccessToken
}