import express, { Request, Response } from 'express'
import cors from 'cors'
import { envVars } from './app/config/env'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'welcome to the ride booking server'
    })
})

export default app