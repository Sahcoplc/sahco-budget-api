import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateHashString } from "../utils/encrypt.js";
import { createCustomError } from "../utils/customError.js";
import asyncWrapper from "../middlewares/async.js";
import BadRequestError from "../utils/errors/badRequest.js";
import { comparePassword } from "../utils/decrypt.js";


const payload = (user) => {
    const token = jwt.sign(
        { id: user.staff_id, email: user.staff_email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
          issuer: "SAHCO PLC",
        }
    );

    delete user.pass_word;
    return { user, token: token };
}

export const login = asyncWrapper(async (req, res) => {
    const { staff_email, pass_word } = req.body;

    try {
        await User.selectAdmin(staff_email, (err, user) => {
            if (err && err.kind === 'not_found') {
                throw new BadRequestError("User does not exist");
            }

            if (err && err.kind === 'A valid email is required') {
                throw new BadRequestError("A valid email is required");
            }

            if (user) {
                const isPassword = comparePassword(pass_word, user[0].pass_word)
    
                if (!isPassword) {
                    throw new BadRequestError("Invalid credentials");
                }
    
                const data = payload(user[0]);
    
                res.status(200).json({
                    message: "Login Successful",
                    data: data,
                    success: 1,
                });
            }
        }) 
    } catch (error) {
        throw error;
    }
})