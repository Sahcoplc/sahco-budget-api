import { createValidator } from "express-joi-validation"
import Joi from "joi"

export const openRoutes = [
    { method: "GET", path: "/" },
    { method: "GET", path: "/api" }
]

export const constants = {
    "account-type": ["Cost", "Revenue", "Non-Current Asset"]
}

export const validator = createValidator()

export const idSchema = Joi.object({
    id: Joi.string().required()
})

export const createAccountSchema = Joi.object({
    accountCategory: Joi.string().required(),
    accountType: Joi.string().required(),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref("startDate")),
})

export const fetchAccountSchema = Joi.object({
    accountCategory: Joi.string(),
    page: Joi.string(),
    limit: Joi.string()
})