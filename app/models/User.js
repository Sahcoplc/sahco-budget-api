import connectDb from "../db/connect.js";
import { testRegex } from "../utils/regexFunctions.js";
import { createCustomError } from '../utils/customError.js'

//constructor
class User {
    constructor(admin) {
        console.log("the constructor: ", admin);
        this.staff_name = admin.staff_name;
        this.staff_email = admin.staff_email;
        this.pass_word = admin.pass_word;
        this.staff_id = admin.staff_id;
        this.department = admin.department;
        this.gender = admin.gender;
        this.avatar = admin.avatar;
        this.role = admin.role;
    }

    static validateEmail(email) {
        // Return true if email is valid
        return testRegex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, email);
    }

    static createNewAdmin(newAdmin, result) {

        try {
            connectDb.query('INSERT INTO users SET ? ', [newAdmin], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    return result(err, null);
                    // throw createCustomError(`Something happened`, 500)
                }
                return result(null, { id: res.insertId, ...newAdmin });
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static selectAdmin(email, result) {
        const validatedEmail = this.validateEmail(email)

        if (validatedEmail) {
            try {
                connectDb.query(`SELECT * FROM users WHERE staff_email = ?`, [email], (err, res) => {
                    if (err) {
                        console.log('error: ', err);
                        result(err, null);
                        return 
                        // throw new createCustomError(err.message, 500)
                    } 
                    
                    if (res.length === 0) {
                        console.log(res.length, " Existing users with same email");
                        result({ kind: 'not_found' }, null);
                        return 
                        // throw createCustomError(`User not found`, 404);
                    } else {
                        console.log(`${res.length} Found user: `);
                        result(null, res);
                        return 
                    }
                })
            } catch (error) {
                console.log(error);
                throw error;
            }
        } else {
            result({kind: 'A valid email is required'}, null);
            return
        }

    }
}

export default User;