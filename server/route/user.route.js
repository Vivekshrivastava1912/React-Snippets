import {Router} from 'express';
import { creaditplane, deleteUser, forgotPasswordController, getAllUsers, loginController, logoutController, refreshToken, registerUserCantroller, resetpassword, userDetailcontroller, userDetails, verifyForgotPasswordOtp } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const userRouter = Router();
userRouter.post('/register', registerUserCantroller)

userRouter.post('/login', loginController)

userRouter.get('/logout',auth ,  logoutController)

userRouter.put('/update-user',auth,userDetailcontroller)

userRouter.put('/forget-password' , forgotPasswordController)

userRouter.put('/verify-forgot-password-otp' , verifyForgotPasswordOtp)

userRouter.post('/refresh-token' , refreshToken)

userRouter.put('/reset-password' , resetpassword)

userRouter.get('/user-details',auth ,userDetails)

userRouter.put('/tier-update', auth , creaditplane)

// Admin routes
userRouter.get('/all-users', auth, admin, getAllUsers)
userRouter.delete('/delete-user', auth, admin, deleteUser)


export default userRouter;