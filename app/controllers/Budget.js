import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import Budget from "../models/Budget.js";
import Account from '../models/Account.js'

export const createBudget = asyncWrapper(async (req, res) => {

    if (req?.user?.role !== "USER") {
        throw new UnauthenticatedError("Not authorized to access this route");
    }

    const {accountId, department, account_type, january, february, march, april, may, june, july, august, sept, october, nov, december} = req.body

    if (!accountId && !january && !february && !march && !april && !may && !june && !july && !august && !sept && !october && !nov && !december) {
        throw new BadRequestError('Budget records required')

    } else {

        const estimated_budget = ( january * 1) + (february * 1) + (march * 1) + (april * 1) + (may * 1) + (june * 1) + (july * 1) + (august * 1) + (sept * 1) + ( october * 1) + (nov * 1) + (december * 1);
        const data = {
            ...req.body,
            actual_budget: 0,
            status: "PENDING"
        }
        
        if (accountId === 27 || accountId === 28 || accountId === 29 || accountId === 30 || accountId === 31) {
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
                            
                            res.status(500).json({
                                message: "Sorry we could not create your budget this time.",
                                success: 0,
                            });
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
    }

})

export const getUserBudget = asyncWrapper(async (req, res) => {

    const { dept } = req?.user;

    if (!dept) {
        throw new BadRequestError('No department provided')
    }

    try {
        await Budget.findByDepartment(dept, (err, budget) => {
            // if (err) {
            //     throw createCustomError('Sorry we could not get your budget this time', 500)
            // }

            if(err && err.code === 404) {
                res.status(404).json({
                    message: `${dept} has no budget records found`,
                    success: 0,
                });
            }

            if(budget) {
    
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

export const getUserBudgetByDept = asyncWrapper(async (req, res) => {

    const { dept } = req.params;

    if (!dept) {
        throw new BadRequestError('No department provided')
    }

    try {
        await Budget.findByDepartment(dept, (err, budget) => {
            // if (err) {
            //     throw createCustomError('Sorry we could not get your budget this time', 500)
            // }

            if(err && err.code === 404) {
                res.status(404).json({
                    message: `${dept} has no budget records found`,
                    success: 0,
                });
            }

            if(budget) {
    
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
                Account.findById(budget[0].accountId, (err, acc) => {
                    if (err && err.code === 404) {
                        // throw createCustomError(`No user with id: ${userId}`, 404);
                        res.status(404).json({
                          message: `No budget account with id: ${id}`,
                          success: 0,
                        });
                    }

                    if(acc) {
                        const single = {
                            ...budget[0],
                            account: acc[0]
                        }
                        res.status(200).json({
                            message: "Budget details",
                            data: single,
                            success: 1,
                        });
                    }
                })
                
            }
        })
    } catch (error) {
        throw error
    }
})

export const updateBudget = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    const {accountId, january, february, march, april, may, june, july, august, sept, october, nov, december} = req.body

    let budgetData = {}

    if (!accountId && !january && !february && !march && !april && !may && !june && !july && !august && !sept && !october && !nov && !december) {
        throw new BadRequestError('Budget records required')

    } else {
        
        const estimated_budget = ( january * 1) + (february * 1) + (march * 1) + (april * 1) + (may * 1) + (june * 1) + (july * 1) + (august * 1) + (sept * 1) + ( october * 1) + (nov * 1) + (december * 1);
    
        const data = {
            ...req.body,
            actual_budget: 0,
        }
        
        if (accountId === 27 || accountId === 28 || accountId === 29 || accountId === 30 || accountId === 31) {
            data.estimated_budget = 0
            budgetData = data
        } else {
            data.estimated_budget = estimated_budget
            budgetData = data
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
    
                if(budget && budget[0].status === 'APPROVED' || budget && budget[0].status === 'SUSPENDED') {
    
                    res.status(400).json({
                        message: `Approved or suspended budget cannot be updated`,
                        success: 0,
                    });
    
                } else {
                    Budget.updateById(id, budgetData, (err, updates) => {
                        if(err) {
                            res.status(500).json({
                                message: "Sorry we could not update your budget this time.",
                                success: 0,
                            });
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
    }
    

})

export const deleteBudget = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    try {
        await Budget.findById(id, (err, budget) => {
            if(err && err.code === 404) {
                res.status(404).json({
                    message: `No budget with id: ${id}`,
                    success: 0,
                });
            }

            if(budget != null && budget[0].status === "APPROVED" || budget != null && budget[0].status === 'SUSPENDED') {
                
                throw new UnauthenticatedError("Not authorized to access this route");

            } else {
                Budget.deleteById(id, (err, deleted) => {
                    if (err && err.code === 404) {
                        console.log(err)
                    }

                    if (deleted) {

                        res.status(200).json({
                            message: "Budget deleted Successfully",
                            success: 1
                        })
                    }
                })
            }
        })
    } catch (error) {
        throw error
    }
})

export const getAllBudget = asyncWrapper(async (req, res) => {

    const { account_type } = req.body;

    // if(!account_type) {
    //     throw new BadRequestError('No account type provided')
    // }

    try {
        await Budget.findAll((err, budget) => {
            if(err && err.code === 404) {

                res.status(404).json({
                    message: `No budget records with account type: ${account_type}`,
                    success: 0,
                });
            }

            if(budget) {

                res.status(200).json({
                    message: "All budgets",
                    data: budget,
                    success: 1
                })
            }
        })
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
        await Budget.findById(id, (err, budget) => {
            if(err && err.code !== 404 || err && !err.code) {
                console.log(err)
            }
            if (err && err.code === 404) {
                // throw createCustomError(`No user with id: ${userId}`, 404);
                res.status(404).json({
                  message: `No budget with id: ${id}`,
                  success: 0,
                });
            }

            if (budget) {
                Budget.updateByStatus(id, status, (err, updates) => {
                    if(err) {
                        res.status(500).json({
                            message: "Sorry we could not update your budget this time.",
                            success: 0,
                        });
                    }

                    if(updates) {
                        res.status(200).json({
                            message: "Budget Status Updated Successfully",
                            data: updates,
                            success: 1
                        })
                    }
                })
            }
        })
    } catch (error) {
        throw error
    }
})