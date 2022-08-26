import asyncWrapper from "../middlewares/async";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from '../utils/errors/badRequest.js'
import User from "../models/User";
import { generateHashString } from "../utils/encrypt.js";

export const createAdmin = asyncWrapper(async (req, res) => {
    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const { staff_email, pass_word } = req.body;

    try {
        //Check for duplicates
        await User.selectAdmin(staff_email, (err, user) => {
            if (user) {
                throw new BadRequestError("An account with this email already exists");
            }
        })

        const hashedPassword = generateHashString(pass_word)
        const newAdmin = {
            ...req.body,
            pass_word: hashedPassword,
        }

        User.createNewAdmin(newAdmin, (err, res) => {
            
        })
    } catch (error) {
        
    }
})