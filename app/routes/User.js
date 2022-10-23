import express from "express";
import UsersController from "../controllers/User.js";
import authMiddleWare from '../middlewares/auth.js'
import imageUpload from "../middlewares/uploads/imageUpload.js";

const router = express.Router()

const userControl = new UsersController()

router.post('/new', authMiddleWare, userControl.createUser)
router.get('/all', authMiddleWare, userControl.findUsers)
router.get('/:id',authMiddleWare, userControl.findUser)
router.patch('/update', authMiddleWare, imageUpload.array('avatar'), userControl.updateUser)
router.delete('/:id', authMiddleWare, userControl.deleteUser)

// Logged in user
router.get('/user/profile', authMiddleWare, userControl.getSession)

export default router;