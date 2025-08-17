import express, { Request, Response } from 'express'
import cors from 'cors'
import { envVars } from './app/config/env'
import notFound from './app/middleware/notFound.route'
import { router } from './app/routers'
import { globalErrorHandler } from './app/middleware/globalError'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import passport from 'passport'
import './app/config/passport'

const app = express()

// Middlewares
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())

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