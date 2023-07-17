import BudgetController from "../controllers/Budget.js";
import express from "express";

const router = express.Router()

const budgetController = new BudgetController()


router.post('/new', budgetController.createBudget)
router.get('/all', budgetController.getDeptBudget)
router.get('/:id', budgetController.getBudget)
router.patch('/:id', budgetController.updateBudget)
router.delete('/:id', budgetController.deleteBudget)
router.get('/admin/all', budgetController.getAllBudget)
router.get('/admin/:dept', budgetController.getBudgetInDept)
router.get('/admin/sum/profit', budgetController.getAllBudgetProfit)

export default router;