import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BudgetService from "../services/Budget.service.js";
import UsersService from "../services/User.service.js";
import NotificationService from "../services/Notification.service.js";
import { budgetYears } from "../helpers/constants.js";

class BudgetController {

    budgetService;
    userService;
    notifyService;

    constructor() {
        this.budgetService = new BudgetService()
        this.userService = new UsersService()
        this.notifyService = new NotificationService()
    }

    createBudget = asyncWrapper(async (req, res) => {
       
        try {
            const { user: { role, id } } = req
        

            if (role !== "USER") {

                res.status(401).json({
                    message: "Not authorized to access this route.",
                    success: 0,
                });
        
            }
            
            
            const {accountId, january, february, march, april, may, june, july, august, sept, october, nov, december, year} = req.body
            
            if (!(accountId && january && february && march && april && may && june && july && august && sept && october && nov && december && year)) {

                res.status(400).json({
                    message: "Budget records required.",
                    success: 0,
                });
                
            } else {

                const estimated_budget = (january * 1) + (february * 1) + (march * 1) + (april * 1) + (may * 1) + (june * 1) + (july * 1) + (august * 1) + (sept * 1) + (october * 1) + (nov * 1) + (december * 1);
               
                const data = {
                    ...req.body,
                    creatorId: id,
                    actual_budget: 0,
                    status: "PENDING",
                    estimated_budget: estimated_budget
                }
    
                const notify = {
                    userId: id,
                    message: 'A new budget record has been added',
                    isRead: false
                }

                const budget = await this.budgetService.create(data)

                const notification = await this.notifyService.create(notify)
    
                if(typeof budget === "string") {

                    res.status(400).json({
                        message: budget,
                        success: 0,
                    });

                } else {

                    res.status(200).json({
                        message: "Budget Creation Successful.",
                        data: budget,
                        success: 1,
                    });
                }
            }


        } catch (error) {
            
        }
    })

    getBudget = asyncWrapper(async (req, res) => {

        try {
            const { id } = req.params

            const budget = await this.budgetService.findOne(id)

            if(budget) {

                res.status(200).json({
                    message: "Budget Details.",
                    data: budget,
                    success: 1,
                });
            }

        } catch (error) {
            
            throw error
        }
    })

    /**
     * ! Modify this to fetch by dept and year
     */

    getDeptBudget = asyncWrapper(async (req, res) => {

        try {

            const { dept } = req?.user
            const { year } = req.query

            const budget = await this.budgetService.findDeptBudget(dept, year)

            if(budget) {

                res.status(200).json({
                    message: "Budget Details.",
                    data: budget,
                    success: 1,
                });
            }
            
        } catch (error) {
            
            throw error
        }
    })
    
    /**
     * ! Create a get budget by dept and 
     */

    getBudgetInDept = asyncWrapper(async (req, res) => {

        try {
            const { year, dept } = req.query

            const budget = await this.budgetService.findDeptBudget(dept, year)

            if(budget) {

                res.status(200).json({
                    message: "Budget Details.",
                    data: budget,
                    success: 1,
                });
            }
            
        } catch (error) {
            
            throw error
        }
    }) 

    updateBudget = asyncWrapper(async (req, res) => {

        try {

            const { params: { id }, user: { role, staff_name }, body } = req

            const notify = {
                userId: req?.user?.id,
                message: 'A budget record has been updated',
                isRead: false
            }

            if (role === "USER") {

                const budget = await this.budgetService.updateOne(id, body)

                const notification = await this.notifyService.create(notify)

                if(budget) {

                    res.status(200).json({
                        message: "Budget Updated Successfully.",
                        data: budget,
                        success: 1,
                    });
                }

            }

            if (role === "ADMIN") {

                const user = await this.userService.findOne(id)

                const data = {
                    ...body,
                    approved_by: staff_name
                }

                const adminNotify = {
                    userId: req?.user?.id,
                    message: 'A budget record has been reviewed',
                    isRead: false
                }

                const budget = await this.budgetService.updateStatus(id, data)

                const notification = await this.notifyService.create(adminNotify)
    
                if(budget) {
    
                    res.status(200).json({
                        message: "Budget Updated Successfully.",
                        data: budget,
                        success: 1,
                    });
                }

            }


        } catch (error) {
            
            throw error

        }
    })

    deleteBudget = asyncWrapper(async (req, res) => {

        try {
            
            const { params: { id }, user: { role } } = req

            const notify = {
                userId: req?.user.id,
                message: 'A budget record has been deleted',
                isRead: false
            }

            if (role !== "USER") {

                throw new UnauthenticatedError("Not authorized to access this route");
        
            }

            const budget = await this.budgetService.removeOne(id)

            const notification = await this.notifyService.create(notify)

            if (budget) {

                res.status(200).json({
                    message: "Budget deleted successfully",
                    success: 1
                })

            }

        } catch (error) {
            
            throw error

        }
    })

    getAllBudget = asyncWrapper(async (req, res) => {

        try {

            const { query: { year } } = req
            
            if (req?.user?.role !== "ADMIN") {

                throw new UnauthenticatedError("Not authorized to access this route");
        
            }

            const budget = await this.budgetService.findAll(year)

            if(budget) {

                res.status(200).json({
                    message: "All Budget Details.",
                    data: budget,
                    success: 1,
                });
            }

        } catch (error) {
            
            throw error

        }
    })

    getAllBudgetProfit = asyncWrapper(async (req, res) => {

        try {
            
            if (req?.user?.role !== "ADMIN") {

                throw new UnauthenticatedError("Not authorized to access this route");
        
            }

            const { query: { year } } = req

            const budget = await this.budgetService.findAllSum(year)

            if(budget) {

                res.status(200).json({
                    message: "All Budget Profits.",
                    data: budget,
                    success: 1,
                });
            }

        } catch (error) {
            
            throw error

        }
    })

    /***
     * *Fetch all available years in the database
     * ! TO DO: Add this to the routes
     */

    getAllYears = asyncWrapper(async (req, res) => {
        try {
            res.status(200).json({
                message: 'Budget Years',
                success: 1,
                data: budgetYears
            })
        } catch (e) {
            throw e
        }

    })

}

export default BudgetController