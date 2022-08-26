import connectDb from "../db/connect.js";
import { testRegex } from "../utils/regexFunctions.js";

//constructor
class Admin {
    constructor(admin) {
        console.log("the constructor: ", admin);
        this.username = admin.username;
        this.email = admin.email;
        this.pass_word = admin.pass_word;
    }

    validateEmail(email) {
        // Return true if email is valid
        return testRegex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, email);
    }

    createNewAdmin(newAdmin, result) {
        const validatedEmail = this.validateEmail(newAdmin.email)

        if (validatedEmail) {
            try {
                connectDb.query('INSERT INTO admin SET ? ', [newAdmin], (err, res) => {
                    if (err) {
                        console.log('error: ', err);
                        result(err, null);
                        return;
                    }
                    console.log('Registered Admin: ', { id: res.insertId, ...newAdmin });
                    return result(null, { id: res.insertId, ...newAdmin });
                })
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        return 'A valid email is required'
    }

    selectAdmin(email, result) {
        const validatedEmail = this.validateEmail(email)

        if (validatedEmail) {
            
        }
    }
}

export default Admin;