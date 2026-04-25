import {Router} from 'express';
import { creaditplane, forgotPasswordController, loginController, logoutController, registerUserCantroller, resetpassword, userDetailcontroller, userDetails, verifyForgotPasswordOtp } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const userRouter = Router();
userRouter.post('/register', registerUserCantroller)

userRouter.post('/login', loginController)

userRouter.get('/logout',auth ,  logoutController)

userRouter.put('/update-user',auth,userDetailcontroller)

userRouter.put('/forget-password' , forgotPasswordController)

userRouter.put('/verify-forgot-password-otp' , verifyForgotPasswordOtp)

userRouter.put('/reset-password' , resetpassword)

userRouter.get('/user-details',auth ,userDetails)

userRouter.put('/tier-update', auth , creaditplane)

export default userRouter;