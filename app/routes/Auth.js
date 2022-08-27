import express from "express";

const router = express.Router()

import { login } from "../controllers/Auth.js";

router.post('/login', login)

export default router;