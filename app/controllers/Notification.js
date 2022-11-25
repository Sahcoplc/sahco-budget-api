import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import asyncWrapper from "../middlewares/async.js";
import NotificationService from "../services/Notification.service.js";

class NotificationController {

    notifyService;
    constructor() {
        this.notifyService = new NotificationService()
    }

    getRead = asyncWrapper(async (req, res) => {

        try {

            const activities = await this.notifyService.findRead()

            res.status(200).json({
                message: 'Activity details',
                data: activities,
                success: 1
            })

        } catch (e) {
            throw e
        }
    })

    getActivities = asyncWrapper(async (req, res) => {

        try {

            const { user: { role } } = req

            if(role != 'ADMIN') {

                throw new UnauthenticatedError('Not authorized to access this route.')
  
            }

            const activities = await this.notifyService.findAll()

            res.status(200).json({
                message: 'Activity details',
                data: activities,
                success: 1
            })

        } catch (e) {
            throw e
        }
    })

    updateActivity = asyncWrapper(async (req, res) => {

        try {

            const { user: { role }, params: { id } } = req

            if(role != 'ADMIN') {

                throw new UnauthenticatedError('Not authorized to access this route.')
  
            }
 
            const activity = await this.notifyService.updateOne(id)

            res.status(200).json({
                message: 'Activity Updated Successfully',
                data: activity,
                success: 1
            })

        } catch (e) {
            throw e
        }
    })
}

export default NotificationController;