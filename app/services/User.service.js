import AppDataSource from "../db/connect.js";
import User from "../models/User.js";

class UsersService {
    constructor() {
        this.repo = AppDataSource.getRepository(User)
    }

    create = async (body) => {
        try {

            const user = this.repo.create({...body})

            return await this.repo.save(user)

        } catch(err) {

            throw err
        }

    }

    findOne = async (id) => {
        try {
            
            const user = await this.repo.findOne({id: id})
    
            return user;

        } catch (error) {

            throw error
        }
    }

    findEmail = async (email) => {
        try {

            const user = await this.repo.findOneBy({staff_email: email})

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
            const user = await this.repo.delete({id: id})
            console.log('Service: ', user)
            return user;

        } catch (error) {

            throw error
        }
    }

    updateOne = async (id, updates) => {

        try {
            
            const user = await this.repo.findOneBy({id: id})

            user.avatar = updates.avatar
            user.department = updates.department
            user.gender = updates.gender;
            user.otp = updates.otp
            user.otpExpiresIn = updates.otpExpiresIn
            user.pass_word = updates.pass_word
            user.username = updates.username

            await this.repo.save(user)

        } catch (error) {

            throw error
        }
    }
}

export default UsersService;