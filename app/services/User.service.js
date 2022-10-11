import { createCustomError } from "../utils/customError.js";
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
     * Create a new user
     * @param body - User Entity
     * @return User
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
     * @param id - User id
     * @return User
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
     * @param staff_email - User email
     * @return User
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
     * @return Users[]
    */

    findAll = async () => {
        try {
            
            const users = await this.repo.find()
    
            users.map(user => {

                delete user.pass_word
                delete user.otp
                delete user.otpExpiresIn
                
            })
            return users;

        } catch (error) {

            throw error
        }
    }

    removeOne = async (id) => {
        try {
            const user = await this.findOne(id)

            if(!user) {

                throw new BadRequest('User does not exist');
            }
    
            return await this.repo.remove(user);

        } catch (error) {

            throw error
        }
    }

    updateOne = async (id, updates) => {

        try {
            const user = await this.findOne(id)

            if(!user) {
                
                throw createCustomError('User does not exist', 404);
            }

            Object.assign(user, updates)

            // const user = await this.repo.update(id, {avatar: updates.avatar, department: updates.department, gender: updates.gender, otp: updates.otp, otpExpiresIn: updates.otpExpiresIn, pass_word: updates.pass_word, username: updates.username})

            return await this.repo.save(user)

        } catch (error) {

            throw error
        }
    }
}

export default UsersService;