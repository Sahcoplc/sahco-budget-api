import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import { createCustomError } from "../utils/customError.js";
import AccountService from "../services/Account.service.js";

// export const deleteAccount = asyncWrapper(async (req, res) => {

//     if (req?.user?.role !== "ADMIN") {
//         throw new UnauthenticatedError("Not authorized to access this route");
//     }

//     const { id } = req.params

//     try {
//         const account = await Account.deleteById(id)

//         if (account && account.code === 404) {
//             throw createCustomError('Account does not exist', 404)
//         }

//         if(account.affectedRows > 0 && !account.code) {
//             res.status(200).json({
//                 message: "Budget Account Deleted Successfully.",
//                 success: 1
//             })
//         }

//     } catch (error) {
//         throw error
//     }
// })

class AccountController {

    accountService;

    constructor() {
        this.accountService = new AccountService()
    }

    createAccount = asyncWrapper(async (req, res) => {

        try {

            if (req?.user?.role !== "ADMIN") {

                throw new UnauthenticatedError("Not authorized to access this route");
            }

            const { account_type, account_category } = req.body;

            if(!(account_type && account_category)) {

                throw new BadRequestError("Account fields are required");

            }

            const account = await this.accountService.create(req.body)

            if (account) {

                res.status(200).json({
                    message: "Account Creation Successful.",
                    data: account,
                    success: 1,
                });
            }

        } catch (error) {
            
            throw error

        }
    })

    getAccount = asyncWrapper(async (req, res) => {

        try {
            
            if (req?.user?.role !== "ADMIN") {

                throw new UnauthenticatedError("Not authorized to access this route");

            }

            const { id } = req.params

            const account = await this.accountService.findOne(id)

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

    getAccounts = asyncWrapper(async (req, res) => {

        try {

            const { category } = req.query

            if(category) {

                const accounts = await this.accountService.filterAll(category)

                res.status(200).json({
                    message: "Budget Account Details.",
                    data: accounts,
                    success: 1
                })

            } else {

                const accounts = await this.accountService.findAll()
    
                res.status(200).json({
                    message: "Budget Account Details.",
                    data: accounts,
                    success: 1
                })
            }

        } catch (error) {

            throw error

        }
    })

    updateAccount = asyncWrapper(async (req, res) => {

        try {
            const { account_category } = req.body

            if (req?.user?.role !== "ADMIN") {

                throw new UnauthenticatedError("Not authorized to access this route");

            }

            const account = await this.accountService.updateType(account_category, req.body)

            if (account) {

                res.status(200).json({
                    message: "Account updated successfully.",
                    data: account,
                    success: 1
                })

            }

        } catch (error) {

            throw error
        }
    })

    deleteAccount = asyncWrapper(async (req, res) => {

        try {
            
            if (req?.user?.role !== "ADMIN") {
                
                throw new UnauthenticatedError("Not authorized to access this route");
            }

            const { id } = req.params

            const account = await this.accountService.removeOne(id)

            if(account) {
                res.status(200).json({
                    message: "Budget Account Deleted Successfully.",
                    success: 1
                })
            }

        } catch (error) {
            
            throw error

        }
    })
}

export default AccountController