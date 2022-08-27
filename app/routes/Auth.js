import express from "express";

const router = express.Router()

import { login, sendResetOtp } from "../controllers/Auth.js";

router.post('/login', login)
router.post('/request-otp', sendResetOtp)

export default router;