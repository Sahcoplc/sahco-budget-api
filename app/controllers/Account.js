import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import Account from "../models/Account.js";
import { createCustomError } from "../utils/customError.js";

export const createAccount = asyncWrapper(async (req, res) => {

    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const { account_type, account_category } = req.body;

    if(!account_type && !account_category) {
        throw new BadRequestError("Account fields are required");
    }

    try {

        const account = await Account.findOne(account_type)

        if(!account.code) {
            
            throw new BadRequestError('An account with this type already exists.')
        }

        if (account && account.code === 404) {
            const newAcc = new Account(req.body)

            const result = await Account.createNewAccount(newAcc)

            if (result) {

                res.status(200).json({
                    message: "Account Creation Successful.",
                    data: result,
                    success: 1,
                });
            }
        }

    } catch (error) {
        throw error
    }
})


export const getAccount = asyncWrapper(async (req, res) => {

    const category = req.query.category;

    try {
        const account = await Account.findAll(category)

        if (account && account.code === 404) {
            throw createCustomError('Account does not exist', 404)
        }

        if(account) {
            res.status(200).json({
                message: "Budget Account Details.",
                data: account,
                success: 1
            })
        }
        
    } catch (error) {
        throw error
    }
})

export const updateAccount = asyncWrapper(async (req, res) => {

    if (req?.user?.role !== "ADMIN") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const { account_category, start_date, end_date } = req.body;

    if(!(account_category && start_date && end_date)) {
        throw new BadRequestError("Account fields are required");
    }

    try {

        const account = await Account.findByCategory(account_category, req.body)

        if(account && account.code === 404) {

            throw createCustomError(`No account with category: ${account_category}`, 404);
        }

        if (account) {
            const updates = await Account.updateByCategory(req.body)

            if(updates && updates.code === 404) {

                throw createCustomError(`Account does not exist`, 404);
            } 

            if (updates) {
                res.status(200).json({
                    message: "Account updated successfully.",
                    data: updates,
                    success: 1
                })
            }
        }
        
    } catch (error) {
        throw error
    }
})