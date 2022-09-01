import express from "express";
import { createBudget, deleteBudget, getAllBudget, getBudget, getUserBudget, updateBudget } from "../controllers/Budget.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authMiddleWare, createBudget)
router.get('/', authMiddleWare, getUserBudget)
router.get('/:id', authMiddleWare, getBudget)
router.patch('/:id', authMiddleWare, updateBudget)
router.delete('/:id', authMiddleWare, deleteBudget)
router.get('/admin/all', authMiddleWare, getAllBudget)

export default router;