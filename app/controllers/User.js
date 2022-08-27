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
        await User.findOneByEmail(staff_email, (err, user) => {
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

export const getUser = asyncWrapper(async (req, res) => {
    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const userId = req.params.id;

    try {
        await User.findOneById(userId, (err, user) => {
            if(err && err.kind === 'not_found') {
                // throw createCustomError(`No user with id: ${userId}`, 404);
                res.status(404).json({
                    message: `No user with id: ${userId}`,
                    success: 0,
                })
            }

            if (user) {

                delete user[0].pass_word;

                res.status(200).json({
                    message: "User details",
                    data: user,
                    success: 1,
                })
            }
        })
    } catch (error) {
        throw error;
    }
})

export const getUsers = asyncWrapper(async (req, res) => {
    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const name = req.query.staff_name;

    try {
        await User.findAll(name, (err, users) => {
            if (err) {
                throw createCustomError(`Some error occured while retrieving users.`, 500);
            }

            if (users) {
                users.map(user => (
                    delete user.pass_word
                ))
                res.status(200).json({
                    message: "Users",
                    data: users,
                    success: 1,
                })
            }
        })
    } catch (error) {
        throw error
    }
})

export const deleteUser = asyncWrapper(async (req, res) => {
    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const userId = req.params.id;

    try {
        await User.deleteOneById(userId, (err, user) => {
            if(err && err.kind === 'not_found') {
                res.status(200).json({
                    message: "User Deleted Successfully",
                    data: user,
                    success: 1,
                });
            }

            if (user) {

                delete user[0].pass_word;

                res.status(404).json({
                    message: `No user found with id: ${userId}`,
                    data: user,
                    success: 0,
                });
            }
        })
    } catch (error) {
        throw error;
    }
})