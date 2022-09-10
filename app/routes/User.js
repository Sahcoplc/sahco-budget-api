import express from "express";

const router = express.Router()

import { createUser, deleteUser, getProfile, getUser, getUsers, updatedUser } from "../controllers/User.js";
import authMiddleWare from '../middlewares/auth.js'
import imageUpload from "../middlewares/uploads/imageUpload.js";

router.post('/new', authMiddleWare, createUser)
router.get('/all', authMiddleWare, getUsers)
router.get('/:id', authMiddleWare, getUser)
router.patch('/:email', authMiddleWare, imageUpload.array('avatar'), updatedUser)
router.delete('/:id', authMiddleWare, deleteUser)

//Logged in user
router.get('/user/profile', authMiddleWare, getProfile)

export default router;