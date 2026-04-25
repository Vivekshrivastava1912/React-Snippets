import {Router} from 'express';
import { loginController, registerUserCantroller } from '../controllers/user.controller.js';


const userRouter = Router();
userRouter.post('/register', registerUserCantroller)


userRouter.post('/login', loginController)

export default userRouter;