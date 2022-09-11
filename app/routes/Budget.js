import express from "express";
import { createBudget, deleteBudget, getAllBudget, getBudget, getUserBudget, getUserBudgetByDept, updateBudget, updateStatus } from "../controllers/Budget.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

router.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
    res.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.append("Access-Control-Allow-Methods", "GET, POST, DELETE, UPDATE, PUT, PATCH, OPTIONS, HEAD");
    res.append("Access-Control-Allow-Credentials", "true");
    next();
})

router.post('/new',  authMiddleWare, createBudget)
router.get('/all',  authMiddleWare, getUserBudget)
router.get('/:id',  authMiddleWare, getBudget)
router.patch('/:id', authMiddleWare, updateBudget)
router.delete('/:id', authMiddleWare, deleteBudget)
router.get('/admin/all', authMiddleWare, getAllBudget)
router.get('/admin/:dept', authMiddleWare, getUserBudgetByDept)
router.patch('/status/:id', authMiddleWare, updateStatus)

export default router;