import { createCustomError } from "../utils/customError.js";
import AppDataSource from "../db/connect.js";
import Account from "models/Account.js";
import BadRequest from "../utils/errors/badRequest.js";


class AccountService {
    constructor() {
        this.repo = AppDataSource.getRepository(Account)
    }

    /**
     * * create - Create a new account and call all hooks attached
     * ! TODO: Add the account service which creates a new account and initialises the hooks
     * @param {Account} account - Account Entity
     * @return {Account} Account
    */

    create = async (account) => {}

    /**
     * * findeOne - Find a particular account by id
     * ! TODO: Create find one service
     * @param {Account} id - Account id
     * @return {Object} account
     */

    findOne = async (id) => {

        try {
            
            const account = await this.repo.findOneBy({id: id})

            if(!account) {

                throw createCustomError( `No budget account with id: ${id}`, 404)
            }

            return account
            
        } catch (error) {

            throw error
        }
    }

    findAll = async () => {}
}

export default AccountService