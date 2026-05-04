import { Router } from "express";
import auth from "../middleware/auth.js";
import { saveUserCode, getUserCodes } from "../controllers/usercode.controller.js";

const userCodeRouter = Router();

userCodeRouter.post('/add-user-code', auth, saveUserCode);
userCodeRouter.get('/get-user-codes', getUserCodes);

export default userCodeRouter;