import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import Budget from "../models/Budget.js";
import { createCustomError } from "../utils/customError.js";

export const createBudget = asyncWrapper(async (req, res) => {

    if (req?.user?.role !== "USER") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const {accountId, department, account_type, january, february, march, april, may, june, july, august, sept, october, nov, december} = req.body

    const estimated_budget = january + february + march + april + may + june + july + august + sept + october + nov + december;
    const data = {
        ...req.body,
        actual_budget: 0,
        status: "PENDING"
    }
    
    if (accountId === 26 || accountId === 27 || accountId === 28 || accountId === 29 || accountId === 30) {
        console.log(accountId)
        data.estimated_budget = 0
    } else {
        data.estimated_budget = estimated_budget
    }

    try {
        const newBud = new Budget(data)

        await Budget.findByType(department, account_type, (err, result) => {
            if(err && err.code === 404) {

                Budget.createBudgetItem(newBud, (err, newBudget) => {
                    if (err) {
                        throw err
                        // throw createCustomError('Sorry we could not create your budget this time', 500)
                    }
        
                    if(newBudget) {
                        res.status(200).json({
                            message: "Budget Creation Successful.",
                            data: newBudget,
                            success: 1,
                        });
                    }
                })
            }

            if(result) {
                res.status(400).json({
                    message: "A budget with this account already exist.",
                    success: 0,
                });
            }
        })
    } catch (error) {
        throw error
    }
})

export const getUserBudget = asyncWrapper(async (req, res) => {

    const { department } = req.body;

    if (!department) {
        throw new BadRequestError('No department provided')
    }

    try {
        await Budget.findByDepartment(department, (err, budget) => {
            // if (err) {
            //     throw createCustomError('Sorry we could not get your budget this time', 500)
            // }

            if(err && err.code === 404) {
                res.status(404).json({
                    message: `${department} has no budget records found`,
                    success: 0,
                });
            }

            if(budget) {
                console.log(budget)

                res.status(200).json({
                    message: "Budget Details.",
                    data: budget,
                    success: 1,
                });
            }
        })
    } catch (error) {
        throw error
    }
})

export const getBudget = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    try {
        await Budget.findById(id, (err, budget) => {
            if (err && err.code === 404) {
                // throw createCustomError(`No user with id: ${userId}`, 404);
                res.status(404).json({
                  message: `No budget with id: ${id}`,
                  success: 0,
                });
            }

            if(budget) {
                res.status(200).json({
                    message: "Budget details",
                    data: budget,
                    success: 1,
                });
            }
        })
    } catch (error) {
        throw error
    }
})

export const updateBudget = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    const {accountId, january, february, march, april, may, june, july, august, sept, october, nov, december} = req.body

    const estimated_budget = january + february + march + april + may + june + july + august + sept + october + nov + december;
    
    const data = {
        ...req.body,
        actual_budget: 0,
    }
    
    if (accountId === 26 || accountId === 27 || accountId === 28 || accountId === 29 || accountId === 30) {
        data.estimated_budget = 0
    } else {
        data.estimated_budget = estimated_budget
    }

    try {
        await Budget.findById(id, (err, budget) => {
            if (err && err.code === 404) {
                // throw createCustomError(`No user with id: ${userId}`, 404);
                res.status(404).json({
                  message: `No budget with id: ${id}`,
                  success: 0,
                });
            }

            if(budget) {
                Budget.updateById(id, data, (err, updates) => {
                    if(err) {
                        throw err
                    }

                    if(updates) {
                        res.status(200).json({
                            message: "Budget Updated Successfully",
                            data: updates,
                            success: 1
                        })
                    }
                })
            }
        })
    } catch (error) {
        throw error;
    }
})