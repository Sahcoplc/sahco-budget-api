import express from "express";
import { createAccount, getAccount } from "../controllers/Account.js";

const router = express.Router()

import authMiddleWare from '../middlewares/auth.js'

router.post('/', authMiddleWare, createAccount)
router.get('/', authMiddleWare, getAccount)

export default router;