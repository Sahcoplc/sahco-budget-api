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

            throw error
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

            throw error
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

            return user;

        } catch (error) {

            throw error
        }
    }
}

export default UsersService;