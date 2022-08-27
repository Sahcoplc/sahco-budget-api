import express from "express";

const router = express.Router()

import { createUser } from "../controllers/User.js";
import authMiddleWare from '../middlewares/auth.js'

router.post('/', authMiddleWare, createUser)

export default router;