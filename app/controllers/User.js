import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import BadRequestError from "../utils/errors/badRequest.js";
import User from "../models/User.js";
import { generateHashString } from "../utils/encrypt.js";
// import { NotFoundError } from "../utils/customError.js";
import Mail from "./mail/Mail.js";
import Budget from "../models/Budget.js";

export const createUser = asyncWrapper(async (req, res) => {
  if (req?.user?.role !== "ADMIN") {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  const { staff_email, pass_word, role } = req.body;

  if (!role) {
    throw new BadRequestError("User role is required")
  }

  try {
    //Check for duplicates
    await User.findOneByEmail(staff_email, (err, user) => {

      if (err && err.code === 400) {
        throw new BadRequestError("A valid email is required");
      }
      
      if (!err && user.length) {
        // throw new BadRequestError("An account with this email already exists");
        res.status(400).json({
          message: "An account with this email already exists.",
          success: 0,
        });
      }

      if (err && err.code === 404) {
        const hashed = generateHashString(pass_word);

        hashed.then((hashedPassword) => {
          const newUser = new User({
            ...req.body,
            pass_word: hashedPassword,
          });

          User.createNewAdmin(newUser, (err, user) => {
            if (err) {
              throw err;
            }

            if (user) {

                new Mail(newUser.staff_email).sendMail("REGISTRATION", {

                    subject: "Welcome to Skyway Aviation Handling Co.",
                    data: {
                      name: newUser.staff_name,
                      staff_id: newUser.staff_id
                    },
                })

                res.status(200).json({
                  message: "User registration successful.",
                  data: newUser,
                  success: 1,
                });
            }
          });
        });
      }
    });
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
    await User.findOneById(userId, (err, user) => {
      if (err && err.code === 404) {
        // throw createCustomError(`No user with id: ${userId}`, 404);
        res.status(404).json({
          message: `No user with id: ${userId}`,
          success: 0,
        });
      }

      if (user) {
        user.map((user) => {
          delete user.pass_word;
          delete user.otp;
          delete user.otpExpiresIn
        });

        res.status(200).json({
          message: "User details",
          data: user,
          success: 1,
        });
      }
    });
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
    await User.findAll(name, (err, users) => {
      if (err) {
        throw new NotFound(`Some error occured while retrieving users.`,);
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
    });
  } catch (error) {
    throw error;
  }
});

export const updatedUser = asyncWrapper(async (req, res) => {

  const email = req.params.email;
  const { path } = req.files[0];

  const updateUser = {
    ...req.body,
    avatar: path,
  };

  try {
    await User.updateOneByEmail(email, updateUser, (err, user) => {

      if (err && err.code === 400) {
        throw new BadRequestError("A valid email is required");
      }

      if (err && err.code === 404) {
        res.status(404).json({
          message: "User does not exist",
          success: 0,
        });
      }

      if (user) {
        console.log(user)
        res.status(200).json({
            message: "User updated successfully.",
            data: user,
            success: 1
        })
      }
    });
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
    await User.deleteOneById(userId, (err, user) => {
      if (err && err.code === 404) {
        res.status(404).json({
          message: `No user found with id: ${userId}`,
          success: 0,
        });
      }

      if (user) {

        res.status(200).json({
          message: 'User Deleted Successfully',
          success: 1,
        });
      }
    });
  } catch (error) {
    throw error;
  }
});

//Get profile
export const getProfile = asyncWrapper(async (req, res) => {

  const email = req.user.email;

  try {
    await User.findOneByEmail(email, (err, user) => {

      if (err && err.code === 400) {
        throw new BadRequestError("A valid email is required");
      }

      if (err && err.code === 404) {
        // throw createCustomError(`No user with id: ${userId}`, 404);
        res.status(404).json({
          message: `No user with email: ${email}`,
          success: 0,
        });
      }

      if (user) {
        Budget.findByDepartment(user[0].department, (err, budget) => {
          if(err || (err && err.code === 404)) {

            user.map((user) => {
              delete user.pass_word;
              delete user.otp;
              delete user.otpVerificationId,
              delete user.otpExpiresIn
            });

            res.status(200).json({
              message: "User details",
              data: user[0],
              success: 1,
            });
          }

          if (budget) {

            user.map((user) => {
              delete user.pass_word;
              delete user.otp;
              delete user.otpVerificationId,
              delete user.otpExpiresIn
            });

            const currentUser = {
              ...user[0],
            }
            currentUser.budget = budget
  
            res.status(200).json({
              message: "User details",
              data: currentUser,
              success: 1,
            });
          }
        })
      }
    });
  } catch (error) {
    throw error
  }
})