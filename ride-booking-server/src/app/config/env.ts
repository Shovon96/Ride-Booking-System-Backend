import dotenv from "dotenv";

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_TOKEN: string,
    JWT_TOKEN_EXPIRES: string,
    JWT_REFRESH_TOKEN: string,
    JWT_REFRESH_EXPIRES: string,
    EXPRESS_SESSION_SECRET: string,
    FRONTEND_URL: string,
    BCRYPT_SALT_ROUND: string
}


const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "JWT_ACCESS_TOKEN",
        "JWT_TOKEN_EXPIRES",
        "JWT_REFRESH_TOKEN",
        "JWT_REFRESH_EXPIRES",
        "EXPRESS_SESSION_SECRET",
        "FRONTEND_URL",
        "BCRYPT_SALT_ROUND"
    ]

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN as string,
        JWT_TOKEN_EXPIRES: process.env.JWT_TOKEN_EXPIRES as string,
        JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string
    }
}

export const envVars = loadEnvVariables()