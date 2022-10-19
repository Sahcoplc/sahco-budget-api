import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import { createCustomError } from "../utils/customError.js";
import BudgetService from "../services/Budget.service.js";
import UsersService from "../services/User.service.js";

class BudgetController {

    budgetService;
    userService;

    constructor() {
        this.budgetService = new BudgetService()
        this.userService = new UsersService()
    }

    createBudget = asyncWrapper(async (req, res) => {
       
        try {

            if (req?.user?.role !== "USER") {

                // throw new UnauthenticatedError("Not authorized to access this route");
                res.status(401).json({
                    message: "Not authorized to access this route.",
                    success: 0,
                });
        
            }
            
            const {accountId, january, february, march, april, may, june, july, august, sept, october, nov, december} = req.body
            
            if (!(accountId && january && february && march && april && may && june && july && august && sept && october && nov && december)) {
                // throw new BadRequestError('Budget records required')
                res.status(400).json({
                    message: "Budget records required.",
                    success: 0,
                });
                
            } else {

                const estimated_budget = (january * 1) + (february * 1) + (march * 1) + (april * 1) + (may * 1) + (june * 1) + (july * 1) + (august * 1) + (sept * 1) + (october * 1) + (nov * 1) + (december * 1);
               
                const data = {
                    ...req.body,
                    creatorId: req?.user?.id,
                    actual_budget: 0,
                    status: "PENDING"
                }
                
                if (Number(accountId) === 27 || Number(accountId) === 28 || Number(accountId) === 29 || Number(accountId) === 30 || Number(accountId) === 31) {
        
                    data.estimated_budget = 0
    
                } else {
    
                    data.estimated_budget = estimated_budget
                }
    
                const budget = await this.budgetService.create(data)
    
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

    getDeptBudget = asyncWrapper(async (req, res) => {

        try {

            const { dept } = req?.user

            const budget = await this.budgetService.findDeptBudget(dept)

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

    getBudgetInDept = asyncWrapper(async (req, res) => {

        try {

            const { dept } = req?.params

            const budget = await this.budgetService.findDeptBudget(dept)

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

            const { id } = req?.params

            if (req?.user?.role === "USER") {

                const budget = await this.budgetService.updateOne(id, req.body)

                if(budget) {

                    res.status(200).json({
                        message: "Budget Updated Successfully.",
                        data: budget,
                        success: 1,
                    });
                }

            }

            if (req?.user?.role === "ADMIN") {

                const user = await this.userService.findOne(req?.user?.id)

                const data = {
                    ...req.body,
                    approved_by: user.staff_name
                }

                const budget = await this.budgetService.updateStatus(id, data)
    
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
            
            const { id } = req?.params

            if (req?.user?.role !== "USER") {

                throw new UnauthenticatedError("Not authorized to access this route");
        
            }

            const budget = await this.budgetService.removeOne(id)

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
            
            if (req?.user?.role !== "ADMIN") {

                throw new UnauthenticatedError("Not authorized to access this route");
        
            }

            const budget = await this.budgetService.findAll()

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
}

export default BudgetController