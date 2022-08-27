import express from "express";

const router = express.Router()

import { createUser, deleteUser, getUser, getUsers } from "../controllers/User.js";
import authMiddleWare from '../middlewares/auth.js'

router.post('/', authMiddleWare, createUser)
router.get('/', authMiddleWare, getUsers)
router.get('/:id', authMiddleWare, getUser)
router.delete('/:id', authMiddleWare, deleteUser)


export default router;