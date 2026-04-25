import {Router} from 'express';
import { loginController, logoutController, registerUserCantroller } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const userRouter = Router();
userRouter.post('/register', registerUserCantroller)


userRouter.post('/login', loginController)
userRouter.get('/logout',auth ,  logoutController)

export default userRouter;