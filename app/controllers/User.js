import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from '../utils/errors/badRequest.js'
import User from "../models/User.js";
import { generateHashString } from "../utils/encrypt.js";
import { createCustomError } from "../utils/customError.js";

export const createUser = asyncWrapper(async (req, res) => {
    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const { staff_email, pass_word } = req.body;

    try {
        //Check for duplicates
        await User.selectAdmin(staff_email, (err, user) => {
            if (!err && user.length) {
                // throw new BadRequestError("An account with this email already exists");
                res.status(400).json({
                    message: "An account with this email already exists.",
                    success: 0,
                });
            }

            if (err && err.kind === 'A valid email is required') {
                throw new BadRequestError("A valid email is required");
            }

            if (err && err.kind === 'not_found') {
                
                const hashed = generateHashString(pass_word)
                
                hashed.then(hashedPassword => {

                    const newUser = new User({
                        ...req.body,
                        pass_word: hashedPassword,
                        avatar: req.body.avatar === '' || req.body.avatar === undefined ? null : req.body.avatar
                    })
    
                    User.createNewAdmin(newUser, (err, user) => {
                        if(err) {
                            throw err
                            // throw new createCustomError('Some error occured while creating user.', 500)
                        }
            
                        res.status(200).json({
                            message: "User registration successful.",
                            data: newUser,
                            success: 1,
                        });
                    })
                })

            }

        })

    } catch (error) {
        throw error;
    }
})