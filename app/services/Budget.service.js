import { createCustomError } from "../utils/customError.js";
import AppDataSource from "../db/connect.js";
import Budget from "../models/Budget.js";
import BadRequest from "../utils/errors/badRequest.js";
import AccountService from "./Account.service.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import User from "../models/User.js";

/**
 * @type Class
 */

class BudgetService {
    constructor() {
        this.repo = AppDataSource.getRepository(Budget)
        this.accountService = new AccountService()
    }

    /**
     * * create - Create a new user and call all hooks attached
     * ! TODO: Add the budget service which creates a new budget and initialises the hooks
     * @param {Budget} budget - Budget Entity
     * @return {Budget} Budget
    */

    create = async (budget) => {

        try {
            
            const found = await this.findType(budget.department, budget.account_type)
            
            if(found !== null) {

                return 'A budget with this account type already exist.'
                
            }

            const account = await this.accountService.findOne(budget.accountId)

            if(account && new Date(account.end_date) < new Date()) {

                return `Budget submission date has expired`

            } else if(account && new Date(account.start_date) > new Date()) {

                return `Budget submission is yet to commence`

            } else {

                const newBudget = this.repo.create({...budget})

                return await this.repo.save(newBudget)
            }

        } catch (err) {

            throw err
        }
    }

    /**
     * * findeOne - Find a particular budget by id
     * ! TODO: Create find one service
     * @param {Budget} id - Budget id
     * @return {Object} budget
     */
    findOne = async (id) => {

        try {

            const budget = await this.repo.findOneBy({id: id})

            if(!budget) {

                throw new BadRequest('Budget does not exist')
            }

            return budget

        } catch (error) {

            throw error
        }
    }

    /**
     * * findType - Find a particular budget in a department
     * ! TODO: Create a find budget service by account type and department
     * @param {Budget} department 
     * @param {Budget} account_type 
     * @return {Object} Budget
    */

    findType = async (department, account_type) => {

        try {

            const budget = await this.repo.findOneBy({department: department, account_type: account_type})

            if(!budget) {

                return null
                // throw new BadRequest('Budget does not exist')
            }

            return budget

        } catch (error) {

            throw error
        }
    }

    /**
     * * findDept - Find all budgets in a department
     * ! TODO: Create a find budget service by department
     * @param {Budget} department 
     * @return {Object} Budget
    */

    findDeptBudget = async (department) => {

        try {
            
            const budget = await this.repo.createQueryBuilder('budget').leftJoinAndSelect('budget.account', 'account')
            .addSelect('account.id').addSelect('account.account_category').addSelect('account.account_type')
            .where('budget.department = :department', {department}).getMany()

            return budget

        } catch (error) {
            
            throw error
        }
    }

    /**
     * * findAll - Find all budgets
     * ! TODO: Create a find all budget service
     * @return {Object} Budget
    */

    findAll = async () => {

        try {

            const budget = await this.repo.createQueryBuilder('budget')
            .leftJoinAndSelect('budget.account', 'account', 'account.id = budget.accountId').select('account.id')
            .addSelect('account.account_category').addSelect('account.account_type')
            .addSelect('SUM(budget.january)', 'janSum').addSelect('SUM(budget.february)', 'febSum')
            .addSelect('SUM(budget.march)', 'marSum').addSelect('SUM(budget.april)', 'aprSum')
            .addSelect('SUM(budget.may)', 'maySum').addSelect('SUM(budget.june)', 'junSum')
            .addSelect('SUM(budget.july)', 'julSum').addSelect('SUM(budget.august)', 'augSum')
            .addSelect('SUM(budget.sept)', 'septSum').addSelect('SUM(budget.october)', 'octSum')
            .addSelect('SUM(budget.nov)', 'novSum').addSelect('SUM(budget.december)', 'decSum')
            .addSelect('SUM(budget.estimated_budget)', 'estimatedSum').addSelect('SUM(budget.actual_budget)', 'actualSum')
            .groupBy('account.account_type').addGroupBy('account.id').getRawMany()

            return budget

        } catch (error) {
            
            throw error
        }
    }

    /**
     * * updateOne - Update a budget in a department
     * ! TODO: Create a update budget service by id
     * @param {Budget} id
     * @param {Budget} updates
     * @return {Object} Budget
    */

    updateOne = async (id, updates) => {

        try {
            
            const found = await this.findOne(id)
            
            if(found.status === 'APPROVED' || found.status === 'SUSPENDED') {

                throw new BadRequest(`Approved or suspended budget cannot be updated`)

            } else {

                const account = await this.accountService.findOne(found.account)
                
                if(account && new Date(account.end_date) < new Date()) {

                    throw new BadRequest(`Access to update budget has expired`)

                }

                Object.assign(found, updates)

                return await this.repo.save(found)
            }

        } catch (error) {
            
            throw error
        }
    }

    /**
     * * updateStatus - Update a budget in a department
     * ! TODO: Create a update budget service by id
     * @param {Budget} id
     * @param {Budget} status
     * @return {Object} Budget
    */

    updateStatus = async (id, status) => {

        try {
           
            const found = await this.findOne(id)

            if(!found) {
                
                throw createCustomError('Budget does not exist', 404);

            }

            Object.assign(found, status)

            return await this.repo.save(found)

        } catch (error) {
            
            throw error

        }
    }


    /**
     * * removeOne - Remove a budget
     * ! TODO: Create a update budget service by id
     * @param {Budget} id
     * @return {Object} Budget
    */

    removeOne = async (id) => {

        try {
            
            const budget = await this.findOne(id)

            if(budget.status === "APPROVED" || budget.status === 'SUSPENDED') {
                
                throw new UnauthenticatedError("Approved or suspended budget cannot be deleted.");
    
            } else {

                const account = await this.accountService.findOne(budget.account)

                if(account && new Date(account.end_date) < new Date()) {

                    throw new BadRequest(`Access to delete budget has expired`)

                }

                return await this.repo.remove(budget);
            }

        } catch (error) {

            throw error
        }
    }
}

export default BudgetService