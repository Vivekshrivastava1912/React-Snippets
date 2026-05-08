import { Router } from "express";
import auth from "../middleware/auth.js";
import { saveSvg, getSvgs, getSvgsForUser, getAllSvgsAdmin, deleteSvg } from "../controllers/svg.controller.js";
import admin from "../middleware/admin.js";

const svgRouter = Router();

svgRouter.post('/add-svg', auth, saveSvg);
svgRouter.get('/get-svgs', auth, getSvgs);
svgRouter.get('/get-svgs-for-user', auth, getSvgsForUser);

// Admin routes
svgRouter.get('/all-svgs-admin', auth, admin, getAllSvgsAdmin);
svgRouter.delete('/delete-svg-admin', auth, admin, deleteSvg);

export default svgRouter;
