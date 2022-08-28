import express from "express";

const router = express.Router()

import { login, sendResetOtp, verifyResetOtp } from "../controllers/Auth.js";

router.post('/login', login)
router.post('/request-otp', sendResetOtp)
router.post('/verify-otp', verifyResetOtp)

export default router;