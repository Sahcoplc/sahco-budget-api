import connectDb from "../db/connect.js";

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

    static createBudgetItem(newBudget, result) {

        try {
            connectDb.query('INSERT INTO budget SET ? ', [newBudget], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return result(err, null);
                    // throw createCustomError(`Something happened`, 500)
                }
                return result(null, { id: res.insertId, ...newBudget });
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Find a budget by Id -- Used by staff
    static findById(id, result) {

        try {
            connectDb.query(`SELECT * FROM budget WHERE id = ?`, [id], (err, res) => {
                if (err) {
                    console.log('Found error: ', err);
                    result(err, null);
                    return;
                }
                
                if (res.length) {
                    console.log('Found res: ', res)
                    return result(null, res)
                } else {
                    console.log("No found: ", res)
                    return result({code: 404}, null)
                }
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Find all budgets by department -- used by staff/department
    static findByDepartment(department, result) {

        try {
            connectDb.query(`SELECT account.id, account.account_category, account.account_type, budget.department, budget.january, budget.february, budget.march, budget.april, budget.may, budget.june, budget.july, budget.august, budget.sept, budget.october, budget.nov, budget.december, budget.estimated_budget, budget.actual_budget, budget.status FROM account RIGHT JOIN budget ON account.id = budget.accountId WHERE department = ? ORDER BY budget.created_time DESC`, [department], (err, res) => {
                if (err) {
                    console.log('Found error: ', err);
                    result(err, null);
                    return;
                }
                
                if (res.length) {
                    return result(null, res)
                } else {
                    return result({code: 404}, null)
                }
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Find all budgets by account_type
    static findByType(department, account_type, result) {

        try {
            connectDb.query(`SELECT account.id, account.account_category, account.account_type, budget.department, budget.january, budget.february, budget.march, budget.april, budget.may, budget.june, budget.july, budget.august, budget.sept, budget.october, budget.nov, budget.december, budget.estimated_budget, budget.actual_budget, budget.status FROM account RIGHT JOIN budget ON account.id = budget.accountId WHERE department = ? AND account.account_type = ? ORDER BY budget.created_time DESC`, [department, account_type], (err, res) => {
                if (err) {
                    console.log('Found error: ', err);
                    result(err, null);
                    return;
                }
                
                if (res.length) {
                    return result(null, res)
                } else {
                    return result({code: 404}, null)
                }
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Find all Budget
    static findAll(account_type, result) {

        try {
            connectDb.query(`SELECT account.id, account.account_category, account.account_type, SUM(budget.january) AS janSum, SUM(budget.february) AS febSum, SUM(budget.march) AS marSum, SUM(budget.april) AS aprSum, SUM(budget.may) AS maySum, SUM(budget.june) AS junSum, SUM(budget.july) AS julSum, SUM(budget.august) AS augSum, SUM(budget.sept) AS septSum, SUM(budget.october) AS octSum, SUM(budget.nov) AS novSum, SUM(budget.december) AS decSum, SUM(budget.estimated_budget) AS estimatedSum, SUM(budget.actual_budget) AS actualSum FROM account RIGHT JOIN budget ON account.id = budget.accountId WHERE account.account_type = ?`, [account_type], (err, res) => {
                if (err) {
                    console.log('Found error: ', err);
                    result(err, null);
                    return;
                }
                
                if (res.length) {
                    return result(null, res)
                } else {
                    return result({code: 404}, null)
                }
            })
        } catch (error) {
            throw error
        }
    }
    static updateById(id, budget, result) {

        try {
            connectDb.query(`UPDATE budget SET january = ?, february = ?, march = ?, april = ?, may = ?, june = ?, july = ?, august = ?, sept = ?, october = ?, nov = ?, december = ?, estimated_budget = ?, actual_budget = ? WHERE id = ?`, [budget.january, budget.february, budget.march, budget.april, budget.may, budget.june, budget.july, budget.august, budget.sept, budget.october, budget.nov, budget.december, budget.estimated_budget, budget.actual_budget, id], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    result(err, null);
                    return 
                    // throw new createCustomError(err.message, 500)
                } 
                
                if(res.affectedRows == 0) {
                    //not found User with the id
                    result({code: 404}, null);
                    return;

                } else {
                    console.log(`${res.affectedRows} updated budget: `);
                    result(null, { ...budget });
                    return 
                }
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static deleteById(id, result) {

        try {
            connectDb.query(`DELETE FROM budget WHERE id = ?`, [id], (err, res) => {
                if (err) {
                    console.log('Found error: ', err);
                    result(err, null);
                    return;
                }
                
                if (res.affectedRows > 0) {
                    console.log('Found deleted', res)
                    result(null, res)
                    return;
                } else {
                    return result({code: 404}, null)
                }
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default Budget;