import {Router} from 'express'
import { createUser } from '../controller/auth';

const router = Router()

router.post('/create-user',createUser)


export default router;