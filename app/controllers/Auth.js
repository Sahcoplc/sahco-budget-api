import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateHashString } from "../utils/encrypt.js";
import { addHoursToDate } from "../utils/dateFunctions.js";
import { createCustomError } from "../utils/customError.js";
import asyncWrapper from "../middlewares/async.js";
import BadRequestError from "../utils/errors/badRequest.js";
import { comparePassword } from "../utils/decrypt.js";
import Mail from "./mail/Mail.js";


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
        await User.findOneByEmail(staff_email, (err, user) => {
            if (err && err.kind === 'not_found') {
                res.status(404).json({
                    message: "User does not exist",
                    success: 0,
                });
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

export const sendResetOtp =asyncWrapper(async (req, res) => {
    const { staff_email } = req.body;

    try {
        await User.findOneByEmail(staff_email, (err, user) => {
            if (err && err.kind === 'not_found') {
                res.status(404).json({
                    message: "User does not exist",
                    success: 0,
                });
            }

            if (err && err.kind === 'A valid email is required') {
                throw new BadRequestError("A valid email is required");
            }

            if(user) {
                const otp = Math.floor(100000 + Math.random() * 900000)
                const otpExpiresIn = addHoursToDate(new Date(), 1)

                const newUpdate = {
                    ...user[0],
                    otp,
                    otpExpiresIn
                }

                // console.log(newUpdate)

                User.updateOneByEmail(user[0].staff_email, newUpdate, (err, updatedUser) => {
                    if (err && err.kind === 'not_found') {
                        res.status(404).json({
                            message: "User does not exist",
                            success: 0,
                        });
                    }

                    console.log(err)
                    console.log(updatedUser)
                    // if (err && err.kind === 'A valid email is required') {
                    //     throw new BadRequestError("A valid email is required");
                    // }

                    if (updatedUser) {

                        new Mail(updatedUser.staff_email).sendMail("FORGET_PASSWORD", {
                            subject: "RESET PASSWORD",
                            data: {
                                name: updatedUser.staff_name,
                                otp: otp,
                                id: user.id,
                            },
                        })

                        res.status(200).json({
                            message: "OTP sent.",
                            data: {
                              id: updatedUser.id,
                              email: updatedUser.staff_email,
                              otpId: updatedUser.otp,
                            },
                            success: 1,
                        });
                    }
                })

            }
        })
    } catch (error) {
        throw error;
    }
    
})