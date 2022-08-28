import express from "express";

const router = express.Router()

import { createUser, deleteUser, getUser, getUsers, updatedUser } from "../controllers/User.js";
import authMiddleWare from '../middlewares/auth.js'
import imageUpload from "../middlewares/uploads/imageUpload.js";

router.post('/', authMiddleWare, createUser)
router.get('/', authMiddleWare, getUsers)
router.get('/:id', authMiddleWare, getUser)
router.patch('/:email', authMiddleWare, imageUpload.array('avatar'), updatedUser)
router.delete('/:id', authMiddleWare, deleteUser)


export default router;