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
    { id: user.id, email: user.staff_email, dept: user.department },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
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

    if(user && user.code === 400) {
      throw new BadRequestError("A valid email is required");
    }

    if(user && user.code === 404) {
      throw createCustomError('User does not exist', 404)
    }

    if(user && !user.code) {
      const password = await comparePassword(pass_word, user.pass_word);

      if (password) {

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
    }

  } catch (error) {

    throw error;
  }
});

export const sendResetOtp = asyncWrapper(async (req, res) => {
  const { staff_email } = req.body;

  try {

    const user = await User.findOneByEmail(staff_email)

    if(user && user.code === 400) {
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

        const result = User.updateOneByPassword(newUpdate);

        if(result && result.code === 404) {
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
   console.log('Found user: ', user)
    if(user.code && user.code === 404) {

      throw createCustomError(`No user with id: ${id}`, 404)

    } else if(user && user.otp !== (otp * 1)) {

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


        const newUser = User.updateOneByPassword(updatedUser);
        console.log('Reset: ', newUser)
          
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
    }
  } catch (error) {
    throw error;
  }
});
