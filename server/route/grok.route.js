import express from 'express';
import auth from '../middleware/auth.js';
import { grokChat } from '../controllers/grok.controller.js';


const aiRouter = express.Router();

aiRouter.post('/grok',auth,grokChat); 

export default aiRouter;