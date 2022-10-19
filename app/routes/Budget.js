import BudgetController from "../controllers/Budget.js";
import express from "express";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

const budgetController = new BudgetController()


router.post('/new',  authMiddleWare, budgetController.createBudget)
router.get('/all',  authMiddleWare, budgetController.getDeptBudget)
router.get('/:id',  authMiddleWare, budgetController.getBudget)
router.patch('/:id', authMiddleWare, budgetController.updateBudget)
router.delete('/:id', authMiddleWare, budgetController.deleteBudget)
router.get('/admin/all', authMiddleWare, budgetController.getAllBudget)
router.get('/admin/:dept', authMiddleWare, budgetController.getBudgetInDept)

export default router;