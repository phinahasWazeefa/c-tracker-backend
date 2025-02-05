import {Router} from 'express'
import { createUser, getUser, signin } from '../controller/auth';

import *as tokenVerification from '../middleware/tokenVerification';

const router = Router()


router.post('/create-user',createUser);
router.post('/signin',signin);

router.get('/get-user',tokenVerification.isUser,getUser);



export default router;