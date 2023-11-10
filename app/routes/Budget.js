import BudgetController from "../controllers/Budget.js";
import express from "express";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

const budgetController = new BudgetController()


router.get('/all',  authMiddleWare, budgetController.getDeptBudget)
router.get('/:id',  authMiddleWare, budgetController.getBudget)
router.patch('/:id', authMiddleWare, budgetController.updateBudget)
router.get('/admin/all', authMiddleWare, budgetController.getAllBudget)
router.delete('/:id', authMiddleWare, budgetController.deleteBudget)
router.post('/new',  authMiddleWare, budgetController.createBudget)
router.get('/admin/dept', authMiddleWare, budgetController.getBudgetInDept)
router.get('/admin/sum/profit', authMiddleWare, budgetController.getAllBudgetProfit)
router.get('/years/plan', authMiddleWare, budgetController.getAllYears)


export default router;