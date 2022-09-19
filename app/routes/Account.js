import express from "express";
import { createAccount, deleteAccount, getAccount, getAccountById, updateAccount } from "../controllers/Account.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authMiddleWare, createAccount)
router.get('/', authMiddleWare, getAccount)
router.patch('/', authMiddleWare, updateAccount)
router.get('/:id', authMiddleWare, getAccountById)
router.delete('/:id', authMiddleWare, deleteAccount)

export default router;