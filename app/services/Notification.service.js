import AppDataSource from "../db/connect.js";
import Notification from "../models/Notification.js";

class NotificationService {
    constructor() {
        this.repo = AppDataSource.getRepository(Notification)
    }

    create = async (activity) => {

        try {
            
            const newActivity = await this.repo.create(activity)

            return await this.repo.save(newActivity)

        } catch (e) {
            throw e
        }
    }

    updateOne = async (id) => {
        try {

            const updates = {
                isRead: true
            }
            
            const activity = await this.findOne(id)

            if(!activity) {
                
                throw createCustomError('User does not exist', 404);
            }

            Object.assign(activity, updates)

            return await this.repo.save(activity)

        } catch (e) {
            throw e
        }
    }

    findAll = async () => {

        try {

            const activities = await this.repo.createQueryBuilder('activities')
            .leftJoinAndSelect('activities.user', 'user', 'user.id = activities.userId')
            .getMany()

            return activities;

        } catch (e) {
            throw e
        }
    }

    findRead = async () => {

        try {
            
            const activities = await this.repo.createQueryBuilder('activities')
            .leftJoinAndSelect('activities.user', 'user', 'user.id = activities.userId').where('activities.isRead = :isRead', { isRead: true })
            .getMany()

            return activities;

        } catch (e) {
            throw e
        }
    }
}

export default NotificationService