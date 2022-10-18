import BudgetController from "../controllers/Budget.js";
import express from "express";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

const budgetController = new BudgetController()
// router.post('/new',  authMiddleWare, createBudget)
// router.get('/all',  authMiddleWare, getUserBudget)
// router.get('/:id',  authMiddleWare, getBudget)
// router.patch('/:id', authMiddleWare, updateBudget)
// router.delete('/:id', authMiddleWare, deleteBudget)
// router.get('/admin/all', authMiddleWare, getAllBudget)
// router.get('/admin/:dept', authMiddleWare, getUserBudgetByDept)
// router.patch('/status/:id', authMiddleWare, updateStatus)

router.post('/new',  authMiddleWare, budgetController.createBudget)

export default router;