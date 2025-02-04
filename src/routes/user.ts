import {Router} from 'express'
import { getUser } from '../controller/user';

const router = Router()

router.get('/get-user',getUser)


export default router;