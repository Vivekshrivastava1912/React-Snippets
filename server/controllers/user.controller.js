import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';



//------------------------------------------------------------registration controller------------------------------------------------------------//



export async function registerUserCantroller(request, response) {


    try {

        const { name, email, password } = request.body;


        if (!name || !email || !password) {
            return response.status(400).json({
                message: "please provide all the fields",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (user) {
            return response.json({
                message: "user already exist",
                error: true,
                success: false
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = await UserModel(payload)
        const save = await newUser.save()


        return response.json({
            message: "User registered successfully. Please check your email to verify your account.",
            error: false,
            success: true,
            data: save
        })

    }



    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        });
    }

}

//----------------------------------------------------------------------------------login controller-------------------------------------------//

export async function loginController(request, response) {

    try {
        const { email, password } = request.body;

        const user = await UserModel.findOne({ email })

        if (!email || !password) {
            return response.status(400).json({
                message: "Email and password are required ....",
                error: true,
                success: false
            })
        }

        if (!user) {
            return response.status(400).json({
                message: "user not found",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return response.status(400).json({
                message: "cheack your password."
                , error: true,
                success: false
            })
        }

         const accesstoken = await generatedAccessToken(user._id)
        const refreshtoken = await generatedRefreshToken(user._id)
        const updateuser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }



        response.cookie('accessToken', accesstoken, cookieOptions)
        response.cookie('refreshToken', refreshtoken, cookieOptions)
return response.json({
            message: "Login successful.",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshtoken
            }
        })

    }

    catch (error) {

        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        });

    }


}