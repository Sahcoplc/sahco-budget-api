import connectDb from "../db/connect.js";
import { testRegex } from "../utils/regexFunctions.js";

//constructor
class User {
    constructor(admin) {
        this.staff_name = admin.staff_name;
        this.staff_email = admin.staff_email;
        this.pass_word = admin.pass_word;
        this.staff_id = admin.staff_id;
        this.department = admin.department;
        this.gender = admin.gender;
        this.avatar = admin.avatar;
        this.role = admin.role;
    }

    // Validate email
    static validateEmail(email) {
        // Return true if email is valid
        // let domainRegex = /^\w+([-+.']\w+)*@?(sahcoplc.com|sahcoplc.com.ng)$/
        return testRegex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, email);
    }

    //Create a new user
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

    // Get user by email
    static findOneByEmail(email, result) {
        const validatedEmail = this.validateEmail(email)

        if (validatedEmail) {
            try {
                connectDb.query(`SELECT * FROM users WHERE staff_email = ?`, [email], (err, res) => {
                    if (err) {
                        console.log('error: ', err);
                        return result(err, null);
                    } 
                    
                    if (res.length === 0) {
                        console.log(res.length, " Existing users with same email");
                        return result({code: 404}, null);
                         
                    } else {
                        return result(null, res);
                    }
                })
            } catch (error) {
                console.log(error);
                throw error;
            }
        } else {
            return result({code: 400}, null);
        }

    }

    //Get user by id
    static findOneById(id, result) {

        try {
            connectDb.query(`SELECT * FROM users WHERE id = ?`, [id], (err, res) => {
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

    // Get all users
    static findAll(name, result) {

        let query = "SELECT * FROM users";

        if(name) {
            query += ` WHERE staff_name LIKE '%${name}%'`;
        }

        try {
            connectDb.query(query, (err, res) => {
                if (err) {
                    console.log('error: ', err);
                    result(err, null);
                    return 
                } 

                result(null, res);
                return
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Delete user by id
    static deleteOneById(id, result) {

        try {
            connectDb.query(`DELETE FROM users WHERE id = ?`, [id], (err, res) => {
                if (err) {
                    console.log('Found error: ', err);
                    result(err, null);
                    return;
                }
                
                if (res.affectedRows > 0) {
                    console.log('Found user', res)
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

    // Update user by email
    static updateOneByEmail(email, user, result) {
        const validatedEmail = this.validateEmail(email)

        if (validatedEmail) {
            try {
                connectDb.query(`UPDATE users SET staff_name = ?, department = ?, gender = ?, avatar = ?, otp = ?, otpExpiresIn = ? WHERE staff_email = ?`, [user.staff_name, user.department, user.gender, user.avatar, user.otp, user.otpExpiresIn, email], (err, res) => {
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
                        console.log(`${res.affectedRows} updated user: `);
                        result(null, { ...user });
                        return 
                    }
                })
            } catch (error) {
                console.log(error);
                throw error;
            }
        } else {
            return result({code: 400}, null);
        }
    }
}

export default User;