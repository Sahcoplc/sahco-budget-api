import { createCustomError } from "../utils/errors/customError.js";
import AppDataSource from "../db/connect.js";
import Account from "../models/Account.js";
import BadRequest from "../utils/errors/badRequest.js";
import { Like } from "typeorm";

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

    create = async (account) => {

        try {

            const acc = await this.findType(account.account_type)

            if(acc) {
            
                throw new BadRequest('An account with this type already exists.')
            }

            const newAcc = this.repo.create({...account})

            return await this.repo.save(newAcc)

        } catch (error) {
            
            throw error
        }
    }

    /**
     * * findOne - Find a particular account by id
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

    /**
     * * findType - Find a particular account by type
     * ! TODO: Create find one service
     * @param {Account} account_type - Account type
     * @return {Object} account
    */

    findType = async (account_type) => {

        try {
            
            const account = await this.repo.findOneBy({account_type: account_type})
    
            // if(!account) {

            //     throw createCustomError( `No budget account with id: ${id}`, 404)
            // }

            return account
            
        } catch (error) {

            throw error
        }
    }


    /**
     * * findAll - Find all accounts
     * ! TODO: Create find all service
     * @return {Array} account
    */
    findAll = async () => {

        try {
           
            const accounts = await this.repo.find()

            return accounts;

        } catch (error) {

            throw error
        }
    }

    /**
     * * filterAll - Gets all accounts by search
     * @param {Account} account_category
     * @return {Array<Account>} accounts[]
    */

    filterAll = async (account_category) => {

        try {
            
            const accounts = await this.repo.findBy({ account_category: Like(`%${account_category}%`) })

            return accounts

            
        } catch (error) {
            
            throw error
        }
    }
    /**
     * * updateType - Update an account by type
     * ! TODO: Create a update account service by account type
     * @param {Account} account_category
     * @param {Account} updates
     * @return {Object} Account
    */
    updateType = async (account_category, updates) => {

        try {
            
            const accounts = await this.repo.find(account_category)
            
            if(!accounts) {
                
                throw createCustomError('Account does not exist', 404);

            }

            accounts.map(account => {

                Object.assign(account, updates)
            })

            await this.repo.update({account_category: account_category}, {start_date: updates.start_date, end_date: updates.end_date})

            return await this.findAll()

        } catch (error) {

            throw error

        }
    }

    /**
     * * removeOne - Remove an account by id
     * ! TODO: Create a remove account service by account id
     * @param {Account} id
     * @return {Object} Account
    */

    removeOne = async (id) => {

        try {
            
            const account = await this.findOne(id)

            return await this.repo.remove(account)

        } catch (error) {
            
            throw error

        }
    }
}

export default AccountService