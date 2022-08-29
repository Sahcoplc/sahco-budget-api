import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import Account from "../models/Account.js";

export const createAccount = asyncWrapper(async (req, res) => {

    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const { account_type, account_category } = req.body;

    if(!account_type && !account_category) {
        throw new BadRequestError("Account fields are required");
    }

    try {
        await Account.findOne(account_type, (err, acc) => {

            if(acc.length) {
                res.status(400).json({
                    message: "An account with this type already exists.",
                    success: 0,
                });
                // throw new BadRequestError('An account with this type already exists.')
            }

            if (err && err.code === 404) {
                Account.createNewAccount(req.body, (err, newAcc) => {
                    if (err) {
                        throw err;
                    }

                    if (newAcc) {
                        console.log(newAcc)

                        res.status(200).json({
                            message: "Account Creation Successful.",
                            data: newAcc,
                            success: 1,
                        });
                    }
                })
            }
        })
    } catch (error) {
        throw error
    }
})


export const getAccount = asyncWrapper(async (req, res) => {

    const category = req.query.category;

    try {
        await Account.findAll(category, (err, acc) => {
            if (err && err.code === 404) {
                res.status(404).json({
                    message: "Account does not exist",
                    success: 0,
                })
            }

            if (acc) {
                res.status(200).json({
                    message: "Budget Account Details.",
                    data: acc,
                    success: 1
                })
            }
        })
    } catch (error) {
        throw error
    }
})