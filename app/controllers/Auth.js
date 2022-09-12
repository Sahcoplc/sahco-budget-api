import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { addHoursToDate } from "../utils/dateFunctions.js";
import asyncWrapper from "../middlewares/async.js";
import BadRequestError from "../utils/errors/badRequest.js";
import { comparePassword } from "../utils/decrypt.js";
import Mail from "./mail/Mail.js";
import { generateHashString } from "../utils/encrypt.js";
import { createCustomError } from "../utils/customError.js";

const payload = (user) => {
  const token = jwt.sign(
    { id: user.staff_id, email: user.staff_email, dept: user.department },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
      issuer: "SAHCO PLC",
    }
  );

  delete user.pass_word;
  return { user, token: token };
};

export const login = asyncWrapper(async (req, res) => {
  const { staff_email, pass_word } = req.body;

  try {
    const user = await User.findOneByEmail(staff_email)

    if(user.code && user.code === 400) {
      throw new BadRequestError("A valid email is required");
    }

    if(user) {
      const password = comparePassword(pass_word, user.pass_word);

      password.then((isPassword) => {
        if (isPassword) {

          const data = payload(user);

          delete data.user.otp;
          delete data.user.otpExpiresIn;

          res.status(200).json({
            message: "Login Successful",
            data: data,
            success: 1,
          });
        } else {
          res.status(400).json({
            message: "Invalid credentials",
            success: 0,
          });
        }

      }).catch(err => {
        console.log(err)
      });
    }

  } catch (error) {

    throw error;
  }
});

export const sendResetOtp = asyncWrapper(async (req, res) => {
  const { staff_email } = req.body;

  try {

    const user = await User.findOneByEmail(staff_email)

    if(user.code && user.code === 400) {
      throw new BadRequestError("A valid email is required");
    }

    if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresIn = addHoursToDate(new Date(), 1);

        const newUpdate = {
          ...user,
          otp,
          otpExpiresIn,
        };

        const result = User.updateOneByEmail(newUpdate);

        if(result.code && result.code === 404) {
            throw createCustomError("User does not exist", 404)
        }

        if(result) {
          new Mail(newUpdate.staff_email).sendMail("FORGET_PASSWORD", {
            subject: "RESET PASSWORD",
            data: {
              name: newUpdate.staff_name,
              otp: otp,
              id: user.id,
            },
          });

          res.status(200).json({
            message: "OTP Sent Successfully.",
            data: {
              id: newUpdate.id,
              email: newUpdate.staff_email,
            },
            success: 1,
          });
        }
    }


    // await User.findOneByEmail(staff_email, (err, user) => {
    //   if (err && err.code === 404) {
    //     res.status(404).json({
    //       message: "User does not exist",
    //       success: 0,
    //     });
    //   }

    //   if (err && err.code === 400) {
    //     throw new BadRequestError("A valid email is required");
    //   }

    //   if (user) {
    //     const otp = Math.floor(100000 + Math.random() * 900000);
    //     const otpExpiresIn = addHoursToDate(new Date(), 1);

    //     const newUpdate = {
    //       ...user[0],
    //       otp,
    //       otpExpiresIn,
    //     };

    //     User.updateOneByEmail(user[0].staff_email, newUpdate, (err, updatedUser) => {

    //         if (err && err.code === 404) {

    //           res.status(404).json({
    //             message: "User does not exist",
    //             success: 0,
    //           });
    //         }

    //         // if (err && err.kind === 'A valid email is required') {
    //         //     throw new BadRequestError("A valid email is required");
    //         // }

    //         if (updatedUser) {

    //           new Mail(updatedUser.staff_email).sendMail("FORGET_PASSWORD", {
    //             subject: "RESET PASSWORD",
    //             data: {
    //               name: updatedUser.staff_name,
    //               otp: otp,
    //               id: user.id,
    //             },
    //           });

    //           res.status(200).json({
    //             message: "OTP Sent Successfully.",
    //             data: {
    //               id: updatedUser.id,
    //               email: updatedUser.staff_email,
    //             },
    //             success: 1,
    //           });
    //         }
    //       }
    //     );
    //   }
    // });
  } catch (error) {
    throw error;
  }
});

export const verifyResetOtp = asyncWrapper(async (req, res) => {

  const { id, otp, pass_word } = req.body;

  if(!(otp && id)) {
    throw new BadRequestError('OTP code and user id required')
  }

  try {

    const user = await User.findOneById(id)

    if(user.code && user.code === 404) {
      throw createCustomError(`No user with id: ${id}`, 404)
    }

    if(user && user.otp !== (otp * 1)) {

      throw new BadRequestError("Invalid OTP Pin received");

    } else if (user && new Date(user.otpExpiresIn) < new Date()) {

      throw new BadRequestError("OTP Pin expired");

    } else {

      const hashed = generateHashString(pass_word);

      hashed.then((hashedPassword) => {

        const updatedUser = {
            ...user,
            pass_word: hashedPassword,
            otp: 0,
            otpExpiresIn: addHoursToDate(new Date(), 0.5),
        };


        const newUser = User.updateOneByEmail(updatedUser.staff_email);
          
        if(newUser.code && newUser.code === 404) {
            throw new BadRequestError('User does not exist')
        }

        if (newUser) {
            delete newUser.pass_word;
            delete newUser.otp;
            delete newUser.otpExpiresIn;
            delete newUser.otpVerificationId

                
            res.status(200).json({
              message: "Password Updated Successfully",
              data: newUser,
              success: 1,
                });
        }
    });

    // await User.findOneById(id, (err, user) => {

    //     if (err && err.code === 404) {
    //         // throw createCustomError(`No user with id: ${userId}`, 404);
    //         res.status(404).json({
    //             message: `No user with id: ${id}`,
    //             success: 0,
    //         });
    //     }

    //     if(user && user[0].otp !== (otp * 1)) {

    //         res.status(400).json({
    //             message: "Invalid OTP Pin received",
    //             success: 0,
    //         });

    //        // throw new BadRequestError("Invalid OTP Pin received");

    //     } else if (user && new Date(user[0].otpExpiresIn) < new Date()) {
    //         res.status(400).json({
    //             message: "OTP expired",
    //             success: 0,
    //         });
            
    //         // throw new BadRequestError("OTP expired");

    //     } else {
          
    //       const hashed = generateHashString(pass_word);

    //       hashed.then((hashedPassword) => {

    //         const updatedUser = {
    //             ...user[0],
    //             pass_word: hashedPassword,
    //             otp: 0,
    //             otpExpiresIn: addHoursToDate(new Date(), 0.5),
    //         };


    //         User.updateOneByEmail(user[0].staff_email, updatedUser, (err, newUser) => {
              
    //             if (err && err.code === 404) {
    //                 res.status(404).json({
    //                     message: "User does not exist",
    //                     success: 0,
    //                 });
    //             }
    
    //             if (newUser) {
    //                 delete newUser.pass_word;
    //                 delete newUser.otp;
    //                 delete newUser.otpExpiresIn;
    //                 delete newUser.otpVerificationId

                    
    //                 res.status(200).json({
    //                     message: "Password Updated Successfully",
    //                     data: newUser,
    //                     success: 1,
    //                 });
    //             }
    //         });
    //       })
    //     }
    // });
    }
  } catch (error) {
    throw error;
  }
});
