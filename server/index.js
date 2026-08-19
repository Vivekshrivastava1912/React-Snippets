import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import userCodeRouter from './route/usercode.route.js'
import aiRouter from './route/grok.route.js'
import svgRouter from './route/svg.route.js'



dotenv.config()

const app = express()


const allowedOrigins = [
    "https://react-snippets-seven.vercel.app",
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));




app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))


app.get('/', (request, response) => {
    response.json({
        message: "Server is running vivek " + (process.env.PORT || 8000)
    })
})


// Ensure DB connection is established before processing API routes
app.use(async (request, response, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        return response.status(500).json({
            message: "Database connection failed",
            error: true,
            success: false
        })
    }
})

app.use('/api/user', userRouter)
app.use('/api/usercode', userCodeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/svg', svgRouter)

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

// Export for Vercel
export default app;

