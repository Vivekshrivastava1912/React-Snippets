import express from 'express';
import auth from '../middleware/auth.js';
import { grokChat } from '../controllers/grok.controller.js';
import { svgGrokChat } from '../controllers/svggrok.controller.js';


const aiRouter = express.Router();

aiRouter.post('/grok',auth,grokChat); 
aiRouter.post('/svggrok',auth, svgGrokChat);

export default aiRouter;