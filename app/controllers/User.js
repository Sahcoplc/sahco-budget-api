import AuthService from "../services/Auth.service.js";
import asyncWrapper from "../middlewares/async.js";
import Mail from "./mail/Mail.js";
// import Budget from "../models/Budget.js";
// import { createCustomError } from "../utils/customError.js";
import UsersService from "../services/User.service.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";

/**
 * The user controller which has some functions to handle user requests.
 * @typedef {Object} UsersController
 * @property {User} createUser - Creates the new user.
 * @property {User} findUser - Finds a particular user.
 * @property {User} findUsers - Gets all users.
 * @property {User} deleteUser - Removes a user.
 * @property {User} updateUser - Updates a user.
 */

/**
 * @class 
 * @param {...UsersController} UsersController - One to three {@link UsersController} objects
 * containing all three components of the User controller.
 */ 
class UsersController {

  userService;
  authService;

  constructor() {
    this.userService = new UsersService()
    this.authService = new AuthService()
  }
  
  createUser = asyncWrapper(async (req, res) => {

    try {

      if (req?.user?.role !== "ADMIN") {

        throw new UnauthenticatedError("Not authorized to access this route");

      }

      const user = await this.authService.signUp(req.body)

      if (user) {

        new Mail(user.staff_email).sendMail("REGISTRATION", {

          subject: "Welcome to Skyway Aviation Handling Co.",
          data: {
            name: user.staff_name,
            password: req.pass_word
          },
        })

        delete user.pass_word
        delete user.otp
        delete user.otpExpiresIn

        res.status(200).json({
          message: "User Created Successfully.",
          data: user,
          success: 1
        })
      }

    } catch (error) {
      throw error
    }
  })

  findUser = asyncWrapper(async (req, res) => {
    try {
       
      if (req?.user?.role !== "ADMIN") {

        throw new UnauthenticatedError("Not authorized to access this route");

      }
      const { id } = req.params

      const user = await this.userService.findOne(id)

      res.status(200).json({
        message: "User Details.",
        data: user,
        success: 1
      })

    } catch (error) {
      throw error
    }
  })

  findUsers = asyncWrapper(async (req, res) => {

    try {

      if (req?.user?.role !== "ADMIN") {

        throw new UnauthenticatedError("Not authorized to access this route");

      }

      const users = await this.userService.findAll()
  
      res.status(200).json({
        message: "Users",
        data: users,
        success: 1
      })

    } catch (error) {
      throw error
    }
  })

  deleteUser = asyncWrapper(async (req, res) => {

    const { id } = req.params

    try {

      if (req?.user?.role !== "ADMIN") {

        throw new UnauthenticatedError("Not authorized to access this route");

      }

      const user = await this.userService.removeOne(id)

      if (user.affected) {
        res.status(200).json({
          message: "User deleted successfully",
          success: 1
        })

      } 

    } catch (error) {

      throw error
    }
  })

  updateUser = asyncWrapper(async (req, res) => {

    try {

      const { id, email } = req?.user

      const { path } = req?.files[0];

      const updateUser = {
        ...req.body,
        id,
        staff_email: email,
        avatar: path,
        updated_time: new Date()
      };

      const user = await this.userService.updateOne(id, updateUser)

      if(user) {
        res.status(200).json({
          message: "User Updated Successfully.",
          data: user,
          success: 1
        })
      } 
    } catch (error) {

      throw error

    }
  })

  getSession = asyncWrapper(async (req, res) => {

    try {
      
      const user = await this.userService
      
    } catch (error) {
      
      throw error

    }
  })
}

export default UsersController;