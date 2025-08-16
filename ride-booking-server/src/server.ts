import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log('connected to db server');
        server = app.listen(envVars.PORT, () => {
            console.log(`Ride Booking server listening port is: ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error, 'error from server')
    }
}

// (async () => {
//     await connectRedis()
//     await startServer()
//     await seedSuperAdmin()
// })()

startServer()

process.on("unhandledRejection", (error) => {
    console.log('Unhandle Rejection...', error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})


process.on("uncaughtException", (error) => {
    console.log('Uncaught Exception Rejection...', error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGTERM", () => {
    console.log('Sigterm Exception Rejection...')
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
