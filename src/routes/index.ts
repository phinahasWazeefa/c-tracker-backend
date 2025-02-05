import { Router } from "express";

import userRoutes from './user';
import authRoutes from './auth';
import { isUser } from "../middleware/tokenVerification";




const routes = Router();


routes.use('/user',isUser,userRoutes);
routes.use('/auth',authRoutes)

export default routes;