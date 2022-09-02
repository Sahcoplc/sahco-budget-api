import express from "express";
import { createAccount, getAccount, updateAccount } from "../controllers/Account.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authMiddleWare, createAccount)
router.get('/', authMiddleWare, getAccount)
router.patch('/', authMiddleWare, updateAccount)

export default router;