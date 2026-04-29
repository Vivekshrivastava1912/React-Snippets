import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import sendEmail from '../config/sendEmail.js';


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
            password: hashedPassword,
            credit: 100
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
        const updateuser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }



        return response.json({
            message: "Login successful.",
            error: false,
            success: true,
            data: {
                accessToken: accesstoken,
                refreshToken: refreshtoken
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

//----------------------------------------------------------logoutcontroller--------------------------------------------------------//

export async function logoutController(request, response) {

    try {

        const userId = request.userId;
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        response.clearCookie('accessToken', cookieOptions);
        response.clearCookie('refreshToken', cookieOptions);
        response.clearCookie('accesstoken', cookieOptions);
        response.clearCookie('refreshtoken', cookieOptions);


        return response.json({
            message: "Logout successful...",
            error: false,
            success: true
        })


    }

    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }



}

//----------------------------------------------------------updateUserdetailCantroller---------------------------------------------------//
export async function userDetailcontroller(request, response) {

    try {
        const userId = request.userId;
        const { name, email, mobile, password } = request.body;

        let hashedpassword = "";
        if (password) {
            const salt = await bcrypt.getSalt(10);
            hashedpassword = await bcrypt.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({ _id: userId },
            {
                ...(name && { name: name }),
                ...(email && { email: email }),
                ...(mobile && { mobile: mobile }),
                ...(password && { password: hashedPassword })
            }
        )
        return response.json({
            message: "updated user successfully...",
            error: false,
            success: true,
            data: updateUser
        })



    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }


}

export async function forgotPasswordController(request, response) {



    try {
        const { email } = request.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({

                message: "Email not available ....",
                error: true,
                success: false

            })
        }

        const otp = generatedOtp()


        const expireTime = new Date(Date.now() + 60 * 60 * 1000)

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forget_password_otp: otp,
            forget_password_expiry: expireTime.toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot Password from FlashMart",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })


        return response.json({
            message: "please Cheack your email",
            error: false,
            success: true
        })


    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}

//--------------------------------------------------verify forgot password otp ----------------------------------------------------------------------//
export async function verifyForgotPasswordOtp(request, response) {

    try {

        const { email, otp } = request.body
        if (!email || !otp) {
            return response.status(400).json({
                message: "please provide required field email and otp ...",
                erro: true,
                success: false
            })

        }


        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({

                message: "Email not available ....",
                error: true,
                success: false

            })
        }

        const currentTime = new Date().toISOString()
        if (user.forget_password_expiry < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            })


        }


        if (otp != user.forget_password_otp) {
            return response.status(400).json({
                message: "Invalid OTP ...",
                error: true,
                success: false
            })
        }





        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forget_password_otp: "",
            forget_password_expiry: ""
        })

        return response.json({
            message: " Verify OTP successfully ... ",
            error: false,
            success: true
        })


    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//---------------------------------------------------reset password -----------------------------------------------------------------------------------//
export async function resetpassword(request, response) {


    try {
        const { email, newPassword, confirmPassword } = request.body


        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide required field email , newPasswoed , confirmPassword .... "
            })

        }


        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email is not Available",
                error: true,
                success: false

            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "NewPassword and ConfirmPassword Not Same ...",
                error: true,
                success: false
            })
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const update = await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        return response.json({
            message: "Password Updated Successfully ...",
            error: false,
            success: true
        })

    }
    catch (error) {

        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// ---------------------------------------------------get login user details ------------------------------------------------------------------------------//

export async function userDetails(request, response) {
    try {
        const userId = request.userId
        console.log(userId)
        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message: 'user details',
            data: user,
            error: false,
            success: true
        })
    }
    catch (error) {
        return response.status(500).json({
            message: 'Somthing is wrong..',
            error: true,
            success: false

        })
    }
}

//----------------------------------------------------creadit plane controller -----------------------------------------------------------------------------------//

export async function creaditplane(request, response) {
    try {
        const userId = request.userId;
        const { plan } = request.body;




        const plans = {
            basic: 500,
            pro: 1000,
            premium: 2000
        };


        if (!(plan in plans)) {
            return response.status(400).json({
                message: "Invalid plan",
                error: true,
                success: false
            });
        }

        // 4. Find user
        const user = await UserModel.findById(userId);

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }


        user.credit += plans[plan];
        await user.save();


        return response.json({
            message: "Plan activated successfully",
            credits: user.credit,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}

//-----------------------------------------------------refresh token controller -------------------------------------------------------------------------//
export async function refreshToken(request, response) {

    try {
        const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.split(" ")[1]
        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token ...",
                error: true,
                success: false
            })
        }


        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)


        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id
        const newAccessToken = await generatedAccessToken(userId)
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        response.clearCookie('accesstoken', cookieOptions)
        response.cookie('accessToken', newAccessToken, cookieOptions)

        // YAHAN ERROR AUR SUCCESS VALUES KO THEEK KIYA HAI
        return response.json({
            message: "New Access token generated...",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })


    }

    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}
