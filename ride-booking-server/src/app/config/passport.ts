import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { Rider } from "../modules/rider/rider.model";
import { ActiveStatus, ApprovalStatus, RiderRole } from "../modules/rider/rider.interface";

// For Google authentication
passport.use(
    new GoogleStrategy({
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        clientID: envVars.GOOGLE_CLIENT_ID,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) {
                return done(null, false, { message: "No Email Found" })
            }

            let user = await Rider.findOne({ email })

            if (user && !user.isVerified) {
                return done(null, false, { message: "This user are not verified!" })
            }

            if (user && (user.isAvailable === ActiveStatus.SUSPENDED || user.isAvailable === ActiveStatus.OFFLINE)) {
                return done(null, false, { message: `This use is ${user.isAvailable}` })
            }

            if (user && (user.approvalStatus === ApprovalStatus.SUSPENDED)) {
                return done(null, false, { message: "This user already suspended!" })
            }

            if (!user) {
                user = await Rider.create({
                    email,
                    name: profile.displayName,
                    photo: profile.photos?.[0].value,
                    role: RiderRole.RIDER,
                    isVerified: true
                })
            }

            return done(null, user)

        } catch (error) {
            return done(error)
        }
    })
)



passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await Rider.findById(id);
        done(null, user)
    } catch (error) {
        done(error)
    }
})