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



startServer()