import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from '../config/connectDB.js'
import userRouter from '../route/user.route.js'
import userCodeRouter from '../route/usercode.route.js'
import aiRouter from '../route/grok.route.js'
import svgRouter from '../route/svg.route.js'



dotenv.config()

const app = express()


app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ["https://react-snippets-seven.vercel.app", "http://localhost:5173", process.env.FRONTEND_URL];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

// Explicitly handle OPTIONS preflight
app.options('*', cors());


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


app.use('/api/user', userRouter)
app.use('/api/usercode', userCodeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/svg', svgRouter)

// Connect to Database
connectDB().catch((error) => {
    console.log('Failed to connect to database', error)
})

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

// Export for Vercel
export default app;

