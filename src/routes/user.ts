import {Router} from 'express'
import { getItems,creatAnItem,creatASesion, addExepnse,
     getASessionOfAUser, getASessionExpenses, closeASesion,
      getSessions, getASessionBill } from '../controller/user';


const router = Router()

router.get('/get-items',getItems);

router.post('/create-item',creatAnItem);

router.post('/create-a-session',creatASesion);

router.get('/get-my-session',getASessionOfAUser);
router.get('/get-my-sessions',getSessions);
router.get('/get-a-session-bill',getASessionBill);

router.post('/add-expense',addExepnse);

router.get('/get-session-expense',getASessionExpenses);

router.post('/close-a-session',closeASesion);


export default router;