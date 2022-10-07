import express from "express";
import UsersController from "../controllers/User.js";

const router = express.Router()

// import { createUser, deleteUser, getProfile, getUser, getUsers, updatedUser } from "../controllers/User.js";
import authMiddleWare from '../middlewares/auth.js'
import imageUpload from "../middlewares/uploads/imageUpload.js";

// router.post('/new', authMiddleWare, createUser)
// router.get('/all', authMiddleWare, getUsers)
// router.get('/:id', authMiddleWare, getUser)
// router.patch('/update', authMiddleWare, imageUpload.array('avatar'), updatedUser)
// router.delete('/:id', authMiddleWare, deleteUser)

//Logged in user
// router.get('/user/profile', authMiddleWare, getProfile)

const userControl = new UsersController()

router.post('/new', userControl.createUser)
router.get('/all', userControl.findUsers)
router.get('/:id', userControl.findUser)
router.delete('/:id', userControl.deleteUser)


export default router;