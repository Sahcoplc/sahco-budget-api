import connectDb from "../db/connect.js";
import { SQL } from "sql-template-strings";

class Budget {
    constructor(budget){
        this.userId = budget.userId;
        this.accountId = budget.accountId;
        this.department = budget.department;
        this.january = budget.january;
        this.february = budget.february;
        this.march = budget.march;
        this.april = budget.april;
        this.may = budget.may;
        this.june = budget.june;
        this.july = budget.july;
        this.august = budget.august;
        this.sept = budget.sept;
        this.october = budget.october;
        this.nov = budget.nov;
        this.december = budget.december;
        this.estimated_budget = budget.estimated_budget;
        this.actual_budget = budget.actual_budget;
        this.status = budget.status;
    }

    static createBudgetItem = async (newBudget) => {

        try {

            const {userId, department, january, february, march, april, may, june, july, august, sept, october, nov, december, estimated_budget, actual_budget} = newBudget

            const query = SQL`INSERT INTO budget SET userId = ${userId}, department = ${department}, january = ${january}, february = ${february}, march = ${march}, april = ${april}, may = ${may}, june = ${june}, july = ${july}, august = ${august}, sept = ${sept}, october = ${october}, nov = ${nov}, december = ${december}, estimated_budget = ${estimated_budget}, actual_budget = ${actual_budget}`;            
            
            const result = await connectDb.query(query).catch(err => { throw err })

            return {id: result.insertId, ...newBudget}
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Find a budget by Id -- Used by staff
    static findById = async (id) => {

        try {

            const query = SQL`SELECT * FROM budget WHERE id = ${id}`

            const [result] = await connectDb.query(query).catch(err => { throw err })

            if(result) {

                return result
    
            } else {
                return {code: 404}
            }

        } catch (error) {
            throw error;
        }
    }

    // Find all budgets by department -- used by staff/department
    static findByDepartment = async (department) => {

        try {

            const query = SQL`SELECT account.id, account.account_category, account.account_type, budget.department, budget.january, budget.february, budget.march, budget.april, budget.may, budget.june, budget.july, budget.august, budget.sept, budget.october, budget.nov, budget.december, budget.estimated_budget, budget.actual_budget, budget.status FROM account RIGHT JOIN budget ON account.id = budget.accountId WHERE budget.department = ${department} ORDER BY budget.created_time DESC`;
            
            const result = await connectDb.query(query).catch(err => { throw err })

            if (result) {
                return result
            } else {
                return {code: 404}
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Find all budgets by account_type
    static findByType = async (department, account_type) => {

        try {
            const query = SQL`SELECT account.id, account.account_category, account.account_type, budget.department, budget.january, budget.february, budget.march, budget.april, budget.may, budget.june, budget.july, budget.august, budget.sept, budget.october, budget.nov, budget.december, budget.estimated_budget, budget.actual_budget, budget.status FROM account RIGHT JOIN budget ON account.id = budget.accountId WHERE budget.department = ${department} AND account.account_type = ${account_type} ORDER BY budget.created_time DESC`
            
            const result = await connectDb.query(query).catch(err => { throw err })
            console.log('Data found: ', result)
            if (result) {

                return result

            } else {
                return {code: 404}
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Find all Budget
    static findAll = async () => {

        try {
            const query = SQL`SELECT account.id, account.account_category, account.account_type, SUM(budget.january) AS janSum, SUM(budget.february) AS febSum, SUM(budget.march) AS marSum, SUM(budget.april) AS aprSum, SUM(budget.may) AS maySum, SUM(budget.june) AS junSum, SUM(budget.july) AS julSum, SUM(budget.august) AS augSum, SUM(budget.sept) AS septSum, SUM(budget.october) AS octSum, SUM(budget.nov) AS novSum, SUM(budget.december) AS decSum, SUM(budget.estimated_budget) AS estimatedSum, SUM(budget.actual_budget) AS actualSum FROM account RIGHT JOIN budget ON account.id = budget.accountId GROUP BY account.id, account.account_category, account.account_type`;
            
            const result = await connectDb.query(query).catch(err => { throw err })
            
            if (result) {

                return result

            } else {
                return {code: 404}
            }

        } catch (error) {
            throw error
        }
    }

    static updateById = async (id, budget) => {

        try {

            const {january, february, march, april, may, june, july, august, sept, october, nov, december, estimated_budget, actual_budget, status} = budget

            const query = SQL`UPDATE budget SET january = ${january}, february = ${february}, march = ${march}, april = ${april}, may = ${may}, june = ${june}, july = ${july}, august = ${august}, sept = ${sept}, october = ${october}, nov = ${nov}, december = ${december}, estimated_budget = ${estimated_budget}, actual_budget = ${actual_budget}, status = ${status} WHERE id = ${id}`
            
            const result = await connectDb.query(query).catch(err => { throw err })

            if(result.affectedRows == 0) {
                //not found User with the id
                return {code: 404}

            } else {
                return {...budget}
            }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // static updateByStatus = async (id, status) => {

    //     try {

    //         const query = SQL`UPDATE budget SET status = ${status} WHERE id = ${id}`
            
    //         const result = await connectDb.query(query).catch(err => { throw err })

    //         if(result.affectedRows == 0) {
    //             //not found User with the id
    //             return {code: 404}

    //         } else {
    //             return {status}
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    static deleteById = async (id) => {

        try {

            const query = SQL`DELETE FROM budget WHERE id = ${id}`

            const result = await connectDb.query(query).catch(err => { throw err })

            
            if(result.affectedRows > 0) {

                return result

            } else {

                return {code: 404}
            }

        } catch (error) {

            console.log(error);

            throw error;
        }
    }
}

export default Budget;