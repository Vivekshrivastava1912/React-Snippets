import { Router } from "express";
import auth from "../middleware/auth.js";
import { saveUserCode, getUserCodes, getCodesForUser, deleteComponent, getAllComponentsAdmin } from "../controllers/usercode.controller.js";
import admin from "../middleware/admin.js";

const userCodeRouter = Router();

userCodeRouter.post('/add-user-code', auth, saveUserCode);
userCodeRouter.get('/get-user-codes', auth, getUserCodes);
userCodeRouter.get('/get-codes-for-user', auth, getCodesForUser);

// Admin routes
userCodeRouter.get('/all-components-admin', auth, admin, getAllComponentsAdmin);
userCodeRouter.delete('/delete-component-admin', auth, admin, deleteComponent);

export default userCodeRouter;