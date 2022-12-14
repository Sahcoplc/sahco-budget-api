import AuthController from "../controllers/Auth.js";
import express from "express";

const router = express.Router()

const authcontroller = new AuthController()

router.post('/login', authcontroller.login)
router.post('/request-otp', authcontroller.requestOtp)
router.post('/verify-otp', authcontroller.verifyOtp)

export default router;