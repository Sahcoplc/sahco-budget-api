import express from "express";
import { createBudget, getUserBudget } from "../controllers/Budget.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authMiddleWare, createBudget)
router.get('/', authMiddleWare, getUserBudget)


export default router;