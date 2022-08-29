import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import { generateHashString } from "../utils/encrypt.js";
import { addHoursToDate } from "../utils/dateFunctions.js";
// import NotFound from "../utils/customError.js";
import asyncWrapper from "../middlewares/async.js";
import BadRequestError from "../utils/errors/badRequest.js";
import { comparePassword } from "../utils/decrypt.js";
import Mail from "./mail/Mail.js";
import { generateHashString } from "../utils/encrypt.js";

const payload = (user) => {
  const token = jwt.sign(
    { id: user.staff_id, email: user.staff_email },
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
    await User.findOneByEmail(staff_email, (err, user) => {
      if (err && err.code === 404) {
        res.status(404).json({
          message: "User does not exist",
          success: 0,
        });
        // throw new NotFound("User does not exist")
      }

      if (err && err.code === 400) {
        throw new BadRequestError("A valid email is required");
      }

      if (user) {
        const password = comparePassword(pass_word, user[0].pass_word);

        password.then((isPassword) => {
          console.log(isPassword);
          if (!isPassword) {
            res.status(400).json({
              message: "Invalid credentials",
              success: 0,
            });
          } else {
            const data = payload(user[0]);

            delete data.user.otp;
            delete data.user.otpExpiresIn;

            res.status(200).json({
              message: "Login Successful",
              data: data,
              success: 1,
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error)
    throw error;
  }
});

export const sendResetOtp = asyncWrapper(async (req, res) => {
  const { staff_email } = req.body;

  try {
    await User.findOneByEmail(staff_email, (err, user) => {
      if (err && err.code === 404) {
        res.status(404).json({
          message: "User does not exist",
          success: 0,
        });
      }

      if (err && err.code === 400) {
        throw new BadRequestError("A valid email is required");
      }

      if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresIn = addHoursToDate(new Date(), 1);

        const newUpdate = {
          ...user[0],
          otp,
          otpExpiresIn,
        };

        User.updateOneByEmail(user[0].staff_email, newUpdate, (err, updatedUser) => {

            if (err && err.code === 404) {

              res.status(404).json({
                message: "User does not exist",
                success: 0,
              });
            }

            // if (err && err.kind === 'A valid email is required') {
            //     throw new BadRequestError("A valid email is required");
            // }

            if (updatedUser) {

              new Mail(updatedUser.staff_email).sendMail("FORGET_PASSWORD", {
                subject: "RESET PASSWORD",
                data: {
                  name: updatedUser.staff_name,
                  otp: otp,
                  id: user.id,
                },
              });

              res.status(200).json({
                message: "OTP Sent Successfully.",
                data: {
                  id: updatedUser.id,
                  email: updatedUser.staff_email,
                },
                success: 1,
              });
            }
          }
        );
      }
    });
  } catch (error) {
    throw error;
  }
});

export const verifyResetOtp = asyncWrapper(async (req, res) => {
  const { id, otp, pass_word } = req.body;

  try {
    await User.findOneById(id, (err, user) => {

        if (err && err.code === 404) {
            // throw createCustomError(`No user with id: ${userId}`, 404);
            res.status(404).json({
                message: `No user with id: ${id}`,
                success: 0,
            });
        }

        if(user && user[0].otp !== otp) {

            res.status(400).json({
                message: "Invalid OTP Pin received",
                success: 0,
            });

           // throw new BadRequestError("Invalid OTP Pin received");

        } else if (user && new Date(user[0].otpExpiresIn) < new Date()) {
            res.status(400).json({
                message: "OTP expired",
                success: 0,
            });
            
            // throw new BadRequestError("OTP expired");

        } else {
          
          const hashed = generateHashString(pass_word);

          hashed.then((hashedPassword) => {

            const updatedUser = {
                ...user[0],
                pass_word: hashedPassword,
                otp: 0,
                otpExpiresIn: addHoursToDate(new Date(), 0.5),
            };


            User.updateOneByEmail(user[0].staff_email, updatedUser, (err, newUser) => {
              
                if (err && err.code === 404) {
                    res.status(404).json({
                        message: "User does not exist",
                        success: 0,
                    });
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
          })
        }
    });
  } catch (error) {
    throw error;
  }
});
