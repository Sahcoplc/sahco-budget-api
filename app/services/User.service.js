import AppDataSource from "../db/connect.js";
import User from "../models/User.js";
import BadRequest from "../utils/errors/badRequest.js";

class UsersService {
    constructor() {
        this.repo = AppDataSource.getRepository(User)
    }

    create = async (body) => {
        try {
            const found = await this.findEmail(body.email)

            if(found) {

                throw new BadRequest('An account already exists with this email')
                
            }

            const user = this.repo.create({...body})

            return await this.repo.save(user)

        } catch(err) {

            throw err
        }

    }

    findOne = async (id) => {
        try {
            
            const user = await this.repo.findOne({id: id})

            if(found) {

                throw new BadRequest('User does not exist')
                
            }
    
            return user;

        } catch (error) {

            throw error
        }
    }

    findEmail = async (staff_email) => {
        try {

            const user = await this.repo.findOneBy({staff_email})

            if(found) {

                throw new BadRequest('No account exists with this email')
                
            }

            return user;

        } catch(err) {

            throw err
        }

    }

    findAll = async () => {
        try {
            
            const users = await this.repo.find()
    
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
                
                throw new BadRequest('User does not exist');
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