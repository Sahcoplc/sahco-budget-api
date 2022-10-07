import { Repository } from "typeorm";
import AppDataSource from "../db/connect.js";
import User from "../models/User.js";

class UsersService {
    constructor() {
        this.repo = AppDataSource.getRepository(User)
    }

    create = async (body) => {
        const user = this.repo.create({...body})

        return await this.repo.save(user)
    }

    findOne = async (id) => {

        const user = await this.repo.findOne({id: id})

        return user;
    }

    findEmail = async (email) => {
        const user = await this.repo.findOne({staff_email: email})

        console.log(user)
        return user;
    }

    findAll = async () => {
        const users = await this.repo.find()

        console.log(users)
        return users;
    }
}

export default UsersService;