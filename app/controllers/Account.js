import asyncWrapper from "../middlewares/async.js";
import Account from "../models/Account.js";
import { error, success } from "../helpers/response.js";
import { createCustomError } from "../utils/errors/customError.js";
import { paginate } from "../helpers/paginate.js";
import BadRequestError from "../utils/errors/badRequest.js";

/**
 * @class
 */
class AccountController {

    /**
     * ! TODO: Create a bulk upload contoller to handle the bulk upload for current budget data, apply same to budget
     */
    uploadAccounts = asyncWrapper(async (req, res) => {
        try {
            
            return success(res, 201)

        } catch (err) {
            return error(res, 500, err)
        }
    })

    createAccount = asyncWrapper(async (req, res) => {

        try {

            const { user: { fullName, _id }, body } = req

            const operator = { id: _id, name: fullName }

            let account = await Account.findOne({ accountType: body.accountType })

            if (account) {
                throw new BadRequestError('Account already exists')
            }

            account = await new Account({ ...body, operator }).save()

           return success(res, 201, account)

        } catch (err) {
            
            return error(res, 500, err)

        }
    })

    getAccount = asyncWrapper(async (req, res) => {

        try {

            const { params: { id } } = req

            const account = await Account.findById({_id: id})

            if(!account) {

                throw createCustomError('Account does not exist', 404)

            } else {

                return success(res, 200, account)
            }

        } catch (err) {
            console.log('ERR::: ', err)
            return error(res, 500, err)

        }
    })

    getAccounts = asyncWrapper(async (req, res) => {

        try {

            const { query: { accountCategory, page, limit } } = req

            let filter = { }

            if(accountCategory) {
                // eslint-disable-next-line prefer-template
                const regex = new RegExp(`${accountCategory}`, 'i');
                filter = { ...filter, accountCategory: { $regex: regex } }
            }

            const modelName = "Account";

            const options = { page, limit, filter, modelName, sort: { createdAt: -1 } };

            const accounts = await paginate(options);

            return success(res, 200, accounts)

        } catch (err) {
            console.log('ERR::: ', err)
            return error(res, 500, err)

        }
    })

    updateAccount = asyncWrapper(async (req, res) => {

        try {
            const { params: { accountCategory }, body } = req

            const accounts = await Account.updateMany({ accountCategory }, { $set: { ...body } }, { new: true })

            return success(res, 200, accounts)

        } catch (err) {

            return error(res, 500, err)
        }
    })

    deleteAccount = asyncWrapper(async (req, res) => {

        try {

            const { id } = req.params

            const account = await Account.findByIdAndDelete({_id: id})

            return success(res, 200, account)

        } catch (err) {
            
            return error(res, 500, err)

        }
    })
}

export default AccountController