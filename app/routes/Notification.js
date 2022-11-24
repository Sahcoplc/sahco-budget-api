import express from "express";
import NotificationController from "../controllers/Notification.js";
import authMiddleWare from '../middlewares/auth.js'

const router = express.Router()

const activityControl = new NotificationController()

router.get('/read', authMiddleWare, activityControl.getRead)
router.get('/', authMiddleWare, activityControl.getActivities)
router.patch('/:id', authMiddleWare, activityControl.updateActivity)

export default router