import { createCustomError } from "../utils/customError.js";
import AppDataSource from "../db/connect.js";
import Budget from "models/Budget.js";
import BadRequest from "../utils/errors/badRequest.js";

/**
 * @type Class
 */

class BudgetService {
    constructor() {
        this.repo = AppDataSource.getRepository(Budget)
    }

    /**
     * * create - Create a new user and call all hooks attached
     * ! TODO: Add the budget service which creates a new budget and initialises the hooks
     * @param {Budget} budget - Budget Entity
     * @return {Budget} Budget
    */

    create = async (budget) => {
        try {
            
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

            const budget = await this.repo.findOneBy({department: department})
            
        } catch (error) {

            throw error
        }
    }
}

export default BudgetService