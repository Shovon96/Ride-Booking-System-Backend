import express, { Request, Response } from 'express'
import cors from 'cors'
import { envVars } from './app/config/env'
import notFound from './app/middleware/notFound.route'
import { router } from './app/routers'
import { globalErrorHandler } from './app/middleware/globalError'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

// Routes
app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'welcome to the ride booking server'
    })
})

app.use(globalErrorHandler)

app.use(notFound)


export default app