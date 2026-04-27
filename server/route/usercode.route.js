import { Router } from "express";
import auth from "../middleware/auth.js";
import { saveUserCode } from "../controllers/usercode.controller.js";

const userCodeRouter = Router();

userCodeRouter.post('/generate-code', auth, saveUserCode);

export default userCodeRouter;