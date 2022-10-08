// import connectDb from "../db/connect.js";
// import {  SQL } from 'sql-template-strings';
// import { testRegex } from "../utils/regexFunctions.js";
import { EntitySchema } from "typeorm";

//constructor
// class User {
//     constructor(admin) {
//         this.staff_name = admin.staff_name;
//         this.staff_email = admin.staff_email;
//         this.pass_word = admin.pass_word;
//         this.staff_id = admin.staff_id;
//         this.department = admin.department;
//         this.gender = admin.gender;
//         this.avatar = admin.avatar;
//         this.role = admin.role;
//     }

//     // Validate email
//     static validateEmail(email){
//         // Return true if email is valid
//         return testRegex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, email);
//     }

//     static validateDomain(email) {
//         // Return true if email is valid
//         // let domainRegex = /^\w+([-+.']\w+)*@?(sahcoplc.com|sahcoplc.com.ng)$/

//         return testRegex(/^\w+([-+.']\w+)*@?(sahcoplc.com|sahcoplc.com.ng)$/, email)
//     }

//     //Create a new user
//     static createNewAdmin = async (newAdmin) => {

//         try {
//             const {staff_email, staff_id, staff_name, department, gender, pass_word, avatar, role, } = newAdmin

//             const validatedEmail = this.validateDomain(staff_email)

//             if(validatedEmail) {

//                 const query = SQL`INSERT INTO users SET staff_name = ${staff_name}, staff_email = ${staff_email}, staff_id = ${staff_id}, department = ${department}, gender = ${gender}, pass_word = ${pass_word}, avatar = ${avatar}, role = ${role}`;
            
//                 const result = await connectDb.query(query).catch(err => { throw err })
    
//                 return {id: result.insertId, ...newAdmin}

//             } else {

//                 return {code: 400};
//             }

//         } catch (error) {
//             throw error
//         }
        
//     }

//     // Get user by email
//     static findOneByEmail = async (email) => {

//         try {
            
//             const validatedEmail = this.validateEmail(email)
    
//             if (validatedEmail) {
    
//                 const query = SQL`SELECT * FROM users WHERE staff_email = ${email}`
    
//                 const [result] = await connectDb.query(query).catch(err => { throw err });
                
//                 if (result) {

//                     return result
//                 } else {
//                     return {code: 404}
//                 }
    
//             } else {
//                 return {code: 400};
//             }
//         } catch (error) {
//             throw error
//         }

//     }

//     //Get user by id
//     static findOneById = async (id) => {

//         try {
//             const query = SQL`SELECT * FROM users WHERE id = ${id}`
    
//             const [result] = await connectDb.query(query).catch(err => { throw err });
            
//             if(result) {
    
//                 return result
    
//             } else {
//                 return {code: 404}
//             }
//         } catch (error) {
//             throw error
//         }
//     }

//     // Get all users
//     static findAll = async (name, department) => {

//         try {
            
//             let query = `SELECT * FROM users`;
    
//             if(name) {
//                 query += ` WHERE staff_name LIKE '%${name}%'`;
                
//             } else if (department) {
//                 query += ` WHERE department LIKE '%${department}%'`;
//             }

//             const result = await connectDb.query(query).catch(err => { throw err });
        
//             if(result) {
    
//                 return result
    
//             } else {
//                 return {code: 404}
//             }
//         } catch (error) {
//             throw error
//         }
//     }

//     // Delete user by id
//     static deleteOneById = async (id) => {

//         try {
            
//             const query = SQL`DELETE FROM users WHERE id = ${id}`
    
//             const result = await connectDb.query(query).catch(err => { throw err });
    
//             if(result.affectedRows > 0) {
//                 return result
//             } else {
//                 return {code: 404}
//             }

//         } catch (error) {
//             throw error
//         }

//     }

//     // Update user by email
//     static updateOneByEmail = async (user) => {
        
//         try {
            
//             const {staff_email, staff_id, staff_name, department, gender, avatar, updated_time} = user
            
//             const validatedEmail = this.validateEmail(staff_email)
    
//             if (validatedEmail) {
    
//                 const query = SQL`UPDATE users SET staff_name = ${staff_name}, staff_id = ${staff_id}, staff_email = ${staff_email}, department = ${department}, gender = ${gender}, avatar = ${avatar}, updated_time = ${updated_time} WHERE staff_email = ${staff_email}`;
    
//                 const result = await connectDb.query(query).catch(err => { throw err })
    
//                 if(result.affectedRows == 0) {
//                     //not found User with the id
//                     return {code: 404}
    
//                 } else {
//                     return {...user}
//                 }
    
//             } else {
//                 return {code: 400};
//             }
//         } catch (error) {
//             throw error
//         }
//     }

//     static updateOneByPassword = async (user) => {
        
//         try {
            
//             const {staff_name, staff_email, staff_id, department, gender, avatar, otp, pass_word, otpExpiresIn } = user
            
//             const validatedEmail = this.validateEmail(staff_email)
    
//             if (validatedEmail) {
    
//                 const query = SQL`UPDATE users SET staff_name = ${staff_name}, staff_id = ${staff_id}, staff_email = ${staff_email}, department = ${department}, gender = ${gender}, avatar = ${avatar}, otp = ${otp}, otpExpiresIn = ${otpExpiresIn}, pass_word = ${pass_word} WHERE staff_email = ${staff_email}`;
    
//                 const result = await connectDb.query(query).catch(err => { throw err })
    
//                 if(result.affectedRows == 0) {
//                     //not found User with the id
//                     return {code: 404}
    
//                 } else {
//                     return {...user}
//                 }
    
//             } else {
//                 return {code: 400};
//             }
//         } catch (error) {
//             throw error
//         }
//     }
// }

const User = new EntitySchema({
    name: "Users", // Will use table name `category` as default behaviour.
    tableName: "users", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        username: {
            type: "varchar",
            unique: true,
            nullable: true,
        },
        staff_name: {
            type: "varchar",
            nullable: false,
        },
        staff_email: {
            type: "varchar",
            length: 200,
            unique: true,
        },
        staff_id: {
            type: "varchar",
            unique: true,
        },
        gender: {
            type: "enum",
            enumName: '',
            enum: ['MALE', 'FEMALE'] 
        },
        department: {
            type: "varchar",
        },
        pass_word: {
            type: "text",
        },
        avatar: {
            type: "text",
            nullable: true
        },
        role: {
            type: "enum",
            enumName: 'USER',
            enum: ['USER', 'ADMIN'] 
        },
        otp: {
            type: "int",
            nullable: true
        },
        otpExpiresIn: {
            type: "datetime",
            nullable: true
        },
        last_loginAt: {
            type: "datetime",
            nullable: true
        },
        created_time: {
            createDate: true
        },
        updated_time: {
            updateDate: true,
        }
    }
})

export default User;