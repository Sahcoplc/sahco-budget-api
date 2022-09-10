import express from "express";
import cors from "cors";
import { createBudget, deleteBudget, getAllBudget, getBudget, getUserBudget, getUserBudgetByDept, updateBudget, updateStatus } from "../controllers/Budget.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://www.sahcoplc.com.ng', 'https://sahcoplc-budget-react.vercel.app'],
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS', 'HEAD'],
    credentials: true
};

router.post('/new', cors(corsOptions), authMiddleWare, createBudget)
router.get('/all', cors(corsOptions), authMiddleWare, getUserBudget)
router.get('/:id', cors(corsOptions), authMiddleWare, getBudget)
router.patch('/:id', cors(corsOptions), authMiddleWare, updateBudget)
router.delete('/:id', cors(corsOptions), authMiddleWare, deleteBudget)
router.get('/admin/all', cors(corsOptions), authMiddleWare, getAllBudget)
router.get('/admin/:dept', cors(corsOptions), authMiddleWare, getUserBudgetByDept)
router.patch('/status/:id', cors(corsOptions), authMiddleWare, updateStatus)

export default router;