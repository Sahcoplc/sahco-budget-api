import express from "express";
import { createBudget, deleteBudget, getAllBudget, getBudget, getUserBudget, getUserBudgetByDept, updateBudget, updateStatus } from "../controllers/Budget.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

router.post('/new', authMiddleWare, createBudget)
router.get('/all', authMiddleWare, getUserBudget)
router.get('/:id', authMiddleWare, getBudget)
router.patch('/:id', authMiddleWare, updateBudget)
router.delete('/:id', authMiddleWare, deleteBudget)
router.get('/admin/all', authMiddleWare, getAllBudget)
router.get('/admin/:dept', authMiddleWare, getUserBudgetByDept)
router.patch('/status/:id', authMiddleWare, updateStatus)

export default router;