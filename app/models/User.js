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
    }

    validateEmail(email) {
        // Return true if email is valid
        return testRegex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, email);
    }

    static createNewAdmin(newAdmin, result) {

        try {
            connectDb.query('INSERT INTO users SET ? ', [newAdmin], (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    result(err, null);
                    throw createCustomError(`Something happened`, 500)
                }
                console.log('Registered Admin: ', { id: res.insertId, ...newAdmin });
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
                connectDb.query(`SELECT * FROM users WHERE email = ?`, [email], (err, res) => {
                    if (err) {
                        console.log('error: ', err);
                        result(err, null);
                        return;
                    } else if (!res.length) {
                        console.log(res.length, " Existing admin with same email");
                        // return result({ kind: 'not_found' }, null);
                        throw createCustomError(`User not found`, 404);
                    } else {
                        console.log(`${res.length} Found admin: `, res);
                        return result(null, res);
                    }
                })
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        return result('A valid email is required')
    }
}

export default User;