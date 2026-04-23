import {Router} from 'express';
import { registerUserCantroller } from '../controllers/user.controller.js';


const userRouter = Router();
userRouter.post('/register', registerUserCantroller)



export default userRouter;