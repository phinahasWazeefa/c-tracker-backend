import {Router} from 'express'
import { getItems,creatAnItem,creatASesion, addExepnse, getASessionOfAUser, getASessionExpenses } from '../controller/user';


const router = Router()

router.get('/get-items',getItems);

router.post('/create-item',creatAnItem);

router.post('/create-a-session',creatASesion);

router.get('/get-my-session',getASessionOfAUser);

router.post('/add-expense',addExepnse);

router.get('/get-session-expense',getASessionExpenses)


export default router;