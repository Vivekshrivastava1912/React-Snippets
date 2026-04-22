import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'


dotenv.config()

const app = express()


app.use(cors({
    origin: [process.env.FRONTEND_URL ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] 
}));

// 2. Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev')) 
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// 3. Routes
app.get('/', (request, response) => {
    response.json({
        message: "Server is running vivek " + (process.env.PORT || 8000)
    })
})




// 4. Database and Server Connection
const PORT = process.env.PORT || 8000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((error) => {
    console.log('Failed to connect to database', error)
})