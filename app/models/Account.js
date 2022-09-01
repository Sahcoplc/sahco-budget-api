import connectDb from "../db/connect.js";

class Account {
    constructor(account) {
        this.account_category = account.account_category;
        this.account_type = account.account_type;
        this.start_date = account.start_date;
        this.end_date = account.end_date;
    }

    // Insert a new account 
    static createNewAccount(newAccount, result) {

        try {
            connectDb.query('INSERT INTO account SET ? ', [newAccount], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return result(err, null);
                    // throw createCustomError(`Something happened`, 500)
                }
                return result(null, { id: res.insertId, ...newAccount });
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Get account by type
    static findOne(account_type, result) {

        try {
            connectDb.query(`SELECT * FROM account WHERE account_type = ?`, [account_type], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return result(err, null);
                } 

                if (res.length === 0) {
                    console.log(res.length, " Existing accounts");
                    return result({code: 404}, null);
                     
                } else {
                    return result(null, res);
                }
            })
        } catch (error) {
            throw error
        }
    }

    // Get account by type
    static findOneByCategory(account_category, result) {

        try {
            connectDb.query(`SELECT * FROM account WHERE account_category = ?`, [account_category], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return result(err, null);
                } 

                if (res.length === 0) {
                    console.log(res.length, " Existing accounts");
                    return result({code: 404}, null);
                     
                } else {
                    return result(null, res);
                }
            })
        } catch (error) {
            throw error
        }
    }

    //Get all account
    static findAll(account_category, result) {
        let query = "SELECT * FROM account";

        if(account_category) {
            query += ` WHERE account_category LIKE '%${account_category}%'`;
        }

        try {
            connectDb.query(query, (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return result(err, null);
                    // throw createCustomError(`Something happened`, 500)
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

    //Update account date
    static updateByCategory(account_category, status, result) {

        try {
            connectDb.query(`UPDATE account SET start_date = ?, end_date = ? WHERE account_category = ?`, [status.start_date, status.end_date, account_category], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return result(err, null);
                    // throw new createCustomError(err.message, 500)
                } 

                if(res.affectedRows == 0) {
                    //not found User with the id
                    result({code: 404}, null);
                    return;

                } else {
                    console.log(`${res.affectedRows} updated accounts: `);
                    result(null, { ...status });
                    return 
                }
            })
        } catch (error) {
            throw err
        }
    }
}

export default Account;