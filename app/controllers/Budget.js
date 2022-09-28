import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import Budget from "../models/Budget.js";
import Account from '../models/Account.js'
import { createCustomError } from "../utils/customError.js";

export const createBudget = asyncWrapper(async (req, res) => {

    if (req?.user?.role !== "USER") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const {accountId, department, account_type, january, february, march, april, may, june, july, august, sept, october, nov, december} = req.body

    if (!(accountId && january && february && march && april && may && june && july && august && sept && october && nov && december)) {
        throw new BadRequestError('Budget records required')

    } else {

        const estimated_budget = ( january * 1) + (february * 1) + (march * 1) + (april * 1) + (may * 1) + (june * 1) + (july * 1) + (august * 1) + (sept * 1) + ( october * 1) + (nov * 1) + (december * 1);
        const data = {
            ...req.body,
            actual_budget: 0,
            status: "PENDING"
        }
        
        if (accountId * 1 === 27 || accountId * 1 === 28 || accountId * 1 === 29 || accountId * 1 === 30 || accountId * 1 === 31) {
            console.log(accountId)
            data.estimated_budget = 0
        } else {
            data.estimated_budget = estimated_budget
        }


        try {
            const newBud = new Budget(data)
    
            const budget = await Budget.findByType(department, account_type)
            
            if(budget && !budget.code) {
                throw new BadRequestError('A budget with this account type already exist.')
            }

            if (budget && budget.code === 404) {
                const acc = await Account.findById(accountId)

                if(acc && acc.code === 404) {

                    throw createCustomError( `No budget account with id: ${accountId}`, 404)
                }

                if(acc && new Date(acc.end_date) < new Date()) {

                    throw new BadRequestError(`Budget submission date has expired`)

                } else if(acc && new Date(acc.start_date) > new Date()) {

                    throw new BadRequestError(`Budget submission is yet to commence`)

                } else {

                    const newBudget = await Budget.createBudgetItem(newBud)
    
                    if(newBudget) {
                        res.status(200).json({
                            message: "Budget Creation Successful.",
                            data: newBudget,
                            success: 1,
                        });
                    }
                }
            }
        } catch (error) {
            throw error
        }
    }

})

export const getUserBudget = asyncWrapper(async (req, res) => {

    const { dept } = req?.user;

    if (!dept) {
        throw new BadRequestError('No department provided')
    }

    try {

        const budget = await Budget.findByDepartment(dept)

        if(budget && budget.code === 404) {
            throw createCustomError( `${dept} has no budget records found`, 404)
        }

        if (budget.length !== 0 && !budget.code) {

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

//Admin to fetch department budget
export const getUserBudgetByDept = asyncWrapper(async (req, res) => {

    const { dept } = req.params;

    if (!dept) {
        throw new BadRequestError('No department provided')
    }

    try {
        const budget = await Budget.findByDepartment(dept)

        if(budget && budget.code === 404) {
            throw createCustomError( `${dept} has no budget records found`, 404)
        }

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

export const getBudget = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    try {

        const budget = await Budget.findById(id)
        console.log('Control: ', budget)

        if(budget && budget.code === 404) {
            throw createCustomError( `No budget with id: ${id}`, 404)
        }

        if(budget) {
            const acc = await Account.findById(budget.accountId)

            if(acc && acc.code === 404) {

                throw createCustomError( `No budget account with id: ${id}`, 404)
            }

            if (acc) {
                const single = {
                    ...budget,
                    account: acc
                }

                res.status(200).json({
                    message: "Budget details",
                    data: single,
                    success: 1,
                });
            }

        }

    } catch (error) {
        throw error
    }
})

export const updateBudget = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    const {accountId, january, february, march, april, may, june, july, august, sept, october, nov, december} = req.body


    if (!(accountId && january && february && march && april && may && june && july && august && sept && october && nov && december)) {
        throw new BadRequestError('Budget records required')

    } else {
        
        const estimated_budget = ( january * 1) + (february * 1) + (march * 1) + (april * 1) + (may * 1) + (june * 1) + (july * 1) + (august * 1) + (sept * 1) + ( october * 1) + (nov * 1) + (december * 1);
    
        const data = {
            ...req.body,
            actual_budget: 0,
        }
        
        if (accountId * 1 === 27 || accountId * 1 === 28 || accountId * 1 === 29 || accountId * 1 === 30 || accountId * 1 === 31) {
            data.estimated_budget = 0
            
        } else {
            data.estimated_budget = estimated_budget
            
        }


        try {

            const budget = await Budget.findById(id)

            if(budget && budget.code === 404) {
                throw createCustomError( `No budget with id: ${id}`, 404)
            }

            if(budget && budget.status === 'APPROVED' || budget && budget.status === 'SUSPENDED') {

                throw new BadRequestError(`Approved or suspended budget cannot be updated`)

            } else {
                
                const acc = await Account.findById(budget.accountId)

                console.log('Control Acc: ', acc)
                if(acc && acc.code === 404) {
                    throw createCustomError( `No budget account with id: ${budget.accountId}`, 404)
                }

                if(acc && new Date(acc.end_date) < new Date()) {

                    throw new BadRequestError(`Access to update budget has expired`)

                } else {
                    const update = await Budget.updateById(id, data)

                    if(update && update.code === 404) {
                        throw createCustomError( `No budget with id: ${id}`, 404)
                    }

                    if(update) {
                        res.status(200).json({
                            message: "Budget Updated Successfully",
                            data: update,
                            success: 1
                        })
                    }
                }
            }

        } catch (error) {
            throw error;
        }
    }
    

})

export const deleteBudget = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    try {

        const budget = await Budget.findById(id)

        if(budget && budget.code === 404) {
            throw createCustomError( `No budget with id: ${id}`, 404)
        }

        if(budget && budget.status === "APPROVED" || budget && budget.status === 'SUSPENDED') {
                
            throw new UnauthenticatedError("Approved or suspended budget cannot be deleted.");

        } else {
            const acc = await Account.findById(budget.accountId)

            if(acc && acc.code === 404) {
                throw createCustomError( `No budget account with id: ${budget.accountId}`, 404)
            }

            if(acc && new Date(acc.end_date) < new Date()) {

                throw new BadRequestError(`Access to delete budget has expired`)

            } else {

                const deleted = await Budget.deleteById(id)

                if(deleted && deleted.code === 404) {
                    throw createCustomError( `No budget with id: ${id}`, 404)
                }

                if(deleted) {
                    res.status(200).json({
                        message: "Budget Deleted Successfully",
                        data: deleted,
                        success: 1
                    })
                }
            }
        }
       
    } catch (error) {
        throw error
    }
})

export const getAllBudget = asyncWrapper(async (req, res) => {

    const { account_type } = req.body;

    try {
        const budget = await Budget.findAll()

        if(budget && budget.code === 404) {
            throw createCustomError( `No budget records with account type: ${account_type}`, 404)
        }

        if (budget) {

            res.status(200).json({
                message: "All budgets",
                data: budget,
                success: 1
            })
        }
        
    } catch (error) {
        throw error
    }
})

export const updateStatus = asyncWrapper(async (req, res) => {

    if (req?.user?.role !== "ADMIN") {

        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const { id } = req.params;

    const { status } = req.body;

    if (!status && !id) {
        throw new BadRequestError('No status provided')
    }

    try {

        const budget = await Budget.findById(id)
        
        if(budget && budget.code === 404) {

            throw createCustomError( `No budget with id: ${id}`, 404)
        }

        if (budget && !budget.code) {

            const updates = await Budget.updateByStatus(id, status)

            if(updates && updates.code === 404) {
                throw createCustomError( `No budget with id: ${id}`, 404)
            }
            
            if (updates && !updates.code) {

                res.status(200).json({
                    message: "Budget Status Updated Successfully",
                    data: updates,
                    success: 1
                })
            }
        }
        
    } catch (error) {
        throw error
    }
})