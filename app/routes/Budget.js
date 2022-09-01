import express from "express";
import { createBudget, getBudget, getUserBudget, updateBudget } from "../controllers/Budget.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authMiddleWare, createBudget)
router.get('/', authMiddleWare, getUserBudget)
router.get('/:id', authMiddleWare, getBudget)
router.patch('/:id', authMiddleWare, updateBudget)


export default router;