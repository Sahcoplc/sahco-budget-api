import { createAccountSchema, fetchAccountSchema, idSchema, validator } from "../base/request.js";
import AccountController from "../controllers/Account.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import express from "express";

const router = express.Router()

const accountController = new AccountController()

router.post('/', validator.body(createAccountSchema), isAuthorized(['super-create', 'create-account'], [], []), accountController.createAccount)
router.get('/', validator.query(fetchAccountSchema), isAuthorized(['super-view', 'view-account'], [], []), accountController.getAccounts)
router.patch('/', validator.body(createAccountSchema), isAuthorized(['super-edit', 'edit-account'], [], []), accountController.updateAccount)
router.get('/:id', validator.params(idSchema), isAuthorized(['super-view', 'view-account'], [], []), accountController.getAccount)
router.delete('/:id', validator.params(idSchema), isAuthorized(['super-delete', 'delete-account'], ['LOS'], ['INTERNAL-AUDIT', 'IT']), accountController.deleteAccount)

export default router;