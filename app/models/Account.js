import SQL from "sql-template-strings";
import connectDb from "../db/connect.js";

class Account {
    constructor(account) {
        this.account_category = account.account_category;
        this.account_type = account.account_type;
        this.start_date = account.start_date;
        this.end_date = account.end_date;
    }

    // Insert a new account 
    static createNewAccount = async (newAccount) => {

        try {
            const { account_category, account_type, start_date, end_date} = newAccount;

            const query = SQL`INSERT INTO account SET account_type = ${account_type}, account_category = ${account_category}, start_date = ${start_date}, end_date = ${end_date}`
            
            const result = await connectDb.query(query).catch(err => { throw err })

            return {id: result.insertId, ...newAccount}

        } catch (error) {
            throw error;
        }
    }

    // Get account by type
    static findOne = async (account_type) => {

        try {
            const query = SQL`SELECT * FROM account WHERE account_type = ${account_type}`

            const [result] = await connectDb.query(query).catch(err => { throw err })

            if(result) {
                return result
    
            } else {
                return {code: 404}
            }

        } catch (error) {
            throw error
        }
    }

    static findById = async (accountId) => {

        try {

            const query = SQL`SELECT * FROM account WHERE id = ${accountId}`

            const [result] = await connectDb.query(query).catch(err => { throw err })

            if(result) {

                return result
    
            } else {
                return {code: 404}
            }
        } catch (error) {
            throw error
        }
    }

    // Get account by type
    static findByCategory = async (account_category) => {

        try {

            const query = SQL`SELECT * FROM account WHERE account_category = ${account_category}`

            const result = await connectDb.query(query).catch(err => { throw err })

            if(result) {

                return result
    
            } else {
                return {code: 404}
            }

        } catch (error) {
            throw error
        }
    }

    //Get all account
    static findAll = async (account_category) => {

        try {

            let query = "SELECT * FROM account";

            if(account_category) {
                query += ` WHERE account_category LIKE '%${account_category}%'`;
            }

            const result = await connectDb.query(query).catch(err => { throw err });
    
            if(result) {

                return result

            } else {
                return {code: 404}
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Update account date
    static updateByCategory = async (status) => {

        try {
            
            const { start_date, end_date, account_category } = status
            
            const query = SQL`UPDATE account SET start_date = ${start_date}, end_date = ${end_date} WHERE account_category = ${account_category}`
            
            const result = await connectDb.query(query).catch(err => { throw err })

            if(result.affectedRows == 0) {
                //not found User with the id
                return {code: 404}

            } else {

                return {...status}
            }
        
        } catch (error) {
            throw error
        }
    }
}

export default Account;