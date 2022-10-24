import { createCustomError } from "../utils/customError.js";
import { Like } from 'typeorm'
import AppDataSource from "../db/connect.js";
import User from "../models/User.js";
import BadRequest from "../utils/errors/badRequest.js";

/**
 * @type Class
 */
class UsersService {
    constructor() {
        this.repo = AppDataSource.getRepository(User)
    }

    /**
     * * create - Create a new user and call all hooks attached
     * @param {User} body - User Entity
     * @return {User} User
    */

    create = async (body) => {

        try {
            const found = await this.findEmail(body.staff_email)
        
            if(found) {

                throw new BadRequest('An account already exists with this email')
                
            }

            const user = this.repo.create({...body})

            return await this.repo.save(user)

        } catch(err) {

            throw err
        }

    }

    /**
     * @param {User} id - User id
     * @return {Object} User
    */

    findOne = async (id) => {
        try {
            
            const user = await this.repo.findOneBy({id: id})

            if(!user) {

                throw new BadRequest('User does not exist')
            }

            delete user.pass_word
            delete user.otp
            delete user.otpExpiresIn

            return user;

        } catch (error) {

            throw error
        }
    }

    /**
     * * findEmail - Get a user by email
     * @param staff_email - User email
     * @return {Object} User
    */

    findEmail = async (staff_email) => {
        try {

            const user = await this.repo.findOneBy({staff_email})

            return user;

        } catch(err) {

            throw err
        }

    }

    /**
     * * filterAll - Gets all users by search
     * @param {User} staff_name
     * @return {Array<User>} users[]
    */

    filterAll = async (staff_name) => {
        try {
            
            const users = await this.repo.findBy({ staff_name: Like(`%${staff_name}%`) })
    
            users.map(user => {

                delete user.pass_word
                delete user.otp
                delete user.otpExpiresIn

                if(user.staff_email === 'rakkoyespa@vusra.com' || user.staff_email === 'lestecolta@vusra.com') {
                    delete user.id
                }
                
            })
            return users;

        } catch (error) {

            throw error
        }
    }

    /**
     * * findAll - Gets all users
     * @return {Array<User>} users[]
    */

    findAll = async () => {
        try {
            
            const users = await this.repo.find()
    
            users.map(user => {

                delete user.pass_word
                delete user.otp
                delete user.otpExpiresIn

                if(user.staff_email === 'rakkoyespa@vusra.com' || user.staff_email === 'lestecolta@vusra.com') {
                    delete user.id
                }
                
            })
            return users;

        } catch (error) {

            throw error
        }
    }

    /**
     * * removeOne - Removes a user and all hooks attached to it
     * @param {User} id 
     * @returns {Object}
     */
    removeOne = async (id) => {
        
        try {
            const user = await this.findOne(id)
    
            return await this.repo.remove(user);

        } catch (error) {

            throw error
        }
    }

    /**
     * * UpdateOne - Updates user information 
     * @param {User} id -  User id to identify user
     * @param {*} updates - User information to be updated
     * @returns {Object} user
     */
    updateOne = async (id, updates) => {

        try {
            const user = await this.findOne(id)

            if(!user) {
                
                throw createCustomError('User does not exist', 404);
            }

            Object.assign(user, updates)

            return await this.repo.save(user)

        } catch (error) {

            throw error
        }
    }
}

export default UsersService;