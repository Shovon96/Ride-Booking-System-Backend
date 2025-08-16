import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import express from 'express'

let server: Server;
const app = express()

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