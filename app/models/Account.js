import connectDb from "../db/connect.js";

class Account {
    constructor(account) {
        this.account_category = account.account_category;
        this.account_type = account.account_type
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
}

export default Account;