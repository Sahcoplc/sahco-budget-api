import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import User from "../models/User.js";
import { generateHashString } from "../utils/encrypt.js";
import Mail from "./mail/Mail.js";
import Budget from "../models/Budget.js";
import { createCustomError } from "../utils/customError.js";

export const createUser = asyncWrapper(async (req, res) => {

  try {
    if (req?.user?.role !== "ADMIN") {
      throw new UnauthenticatedError("Not authorized to access this route");
    }
  
    const { staff_email, pass_word, role } = req.body;
  
    if (!role) {
      throw new BadRequestError("User role is required")
    }
    //Check for duplicates
     const user = await User.findOneByEmail(staff_email)

    if (user && user.code === 400) {

        throw new BadRequestError("A valid email is required");

    }
    
    if (user && !user.code) {

      throw new BadRequestError("An account with this email already exists");
    }
    
    if(!user) {

        const hashed = generateHashString(pass_word);

        hashed.then((hashedPassword) => {
          const newUser = new User({

            ...req.body,
            pass_word: hashedPassword,

          });


          const createdUser = User.createNewAdmin(newUser)

          if (createdUser) {
            new Mail(newUser.staff_email).sendMail("REGISTRATION", {

              subject: "Welcome to Skyway Aviation Handling Co.",
              data: {
                name: newUser.staff_name,
                staff_id: newUser.staff_id
              },
            })

            delete newUser.pass_word

            res.status(200).json({
              message: "User registration successful.",
              data: newUser,
              success: 1,
            });

          }

        })

    }
     
  } catch (error) {
    throw error;
  }
});

export const getUser = asyncWrapper(async (req, res) => {
  if (req?.user?.role !== "ADMIN") {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  const userId = req.params.id;

  try {
    const user = await User.findOneById(userId)

    if(user && user.code === 404) {
      throw createCustomError(`No user with id: ${userId}`, 404);
    }

    if(user) {
      delete user.pass_word;
      delete user.otp;
      delete user.otpExpiresIn

      res.status(200).json({
        message: "User details",
        data: user,
        success: 1,
      });

    }
  } catch (error) {
    throw error;
  }
});

export const getUsers = asyncWrapper(async (req, res) => {
  if (req?.user?.role !== "ADMIN") {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  const name = req.query.staff_name;

  try {

    const users = await User.findAll(name)

    if(users && users.code === 404) {
      throw createCustomError('Some error occured while retrieving users.', 404)
    }

    if (users) {
      users.map((user) => {
        delete user.pass_word;
        delete user.otp;
        delete user.otpVerificationId,
        delete user.otpExpiresIn
      });

      res.status(200).json({
        message: "Users",
        data: users,
        success: 1,
      });
    }
  } catch (error) {
    throw error;
  }
});

export const updatedUser = asyncWrapper(async (req, res) => {

  const email = req?.user?.email

  if (req?.user?.role !== "USER") {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  const { path } = req.files[0];

  const updateUser = {
    ...req.body,
    staff_email: email,
    avatar: path,
  };

  try {
    const user = await User.updateOneByEmail(updateUser)

    if(user && user.code === 400) {
      throw new BadRequestError("A valid email is required");
    }

    if (user && user.code === 400) {
      throw createCustomError("User does not exist", 404)
    }

    if (user) {
      res.status(200).json({
        message: "User updated successfully.",
        data: user,
        success: 1
      })
    }

  } catch (error) {
    throw error
  }
});

export const deleteUser = asyncWrapper(async (req, res) => {
  if (req?.user?.role !== "ADMIN") {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  const userId = req.params.id;

  try {
    const user = await User.deleteOneById(userId)

    if(user && user.code === 404) {
      throw createCustomError(`No user found with id: ${userId}`, 404)
    }

    if(user) {
      res.status(200).json({
        message: 'User Deleted Successfully',
        success: 1,
      });
    }
  } catch (error) {
    throw error;
  }
});

//Get profile
export const getProfile = asyncWrapper(async (req, res) => {

  const email = req?.user?.email;

  try {
    const user = await User.findOneByEmail(email)

    if (user && user.code === 400) {
      throw new BadRequestError("A valid email is required");
    }

    if(user && user.code === 404) {
      throw createCustomError(`No user with email: ${email}`, 404);
    }

    if(user) {
        const budget = Budget.findByDepartment(user.department)

        if (budget.code === 404) {
          delete user.pass_word;
          delete user.otp;
          delete user.otpVerificationId,
          delete user.otpExpiresIn

          res.status(200).json({
            message: "User details",
            data: user,
            success: 1,
          });
        }

        if(budget) {
          delete user.pass_word;
          delete user.otp;
          delete user.otpVerificationId,
          delete user.otpExpiresIn

          const currentUser = {
            ...user,
          }
          currentUser.budget = budget

          res.status(200).json({
            message: "User details",
            data: currentUser,
            success: 1,
          });
        }
    }
  } catch (error) {
    throw error
  }
})