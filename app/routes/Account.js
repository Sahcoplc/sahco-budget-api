import AccountController from "../controllers/Account.js";
import authMiddleWare from '../middlewares/auth.js'
import express from "express";

const router = express.Router()

const accountController = new AccountController()

router.post('/', authMiddleWare, accountController.createAccount)
router.get('/', authMiddleWare, accountController.getAccounts)
router.patch('/', authMiddleWare, accountController.updateAccount)
router.get('/:id', authMiddleWare, accountController.getAccount)
router.delete('/:id', authMiddleWare, accountController.deleteAccount)

export default router;