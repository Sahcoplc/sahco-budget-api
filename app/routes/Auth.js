import AuthController from "../controllers/Auth.js";
import express from "express";

const router = express.Router()

// import { login, sendResetOtp, verifyResetOtp } from "../controllers/Auth.js";


// router.post('/request-otp', sendResetOtp)
// router.post('/verify-otp', verifyResetOtp)

const authcontroller = new AuthController()

router.post('/login', authcontroller.login)
// router.post('/request-otp', sendResetOtp)
// router.post('/verify-otp', verifyResetOtp)

export default router;