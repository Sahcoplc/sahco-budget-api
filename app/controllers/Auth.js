import asyncWrapper from "../middlewares/async.js";
import BadRequestError from "../utils/errors/badRequest.js";
import Mail from "./mail/Mail.js";
import { generateHashString } from "../utils/encrypt.js";
import { createCustomError } from "../utils/customError.js";
import AuthService from "../services/Auth.service.js";

// export const sendResetOtp = asyncWrapper(async (req, res) => {
//   const { staff_email } = req.body;

//   try {

//     const user = await User.findOneByEmail(staff_email)

//     if(user && user.code === 400) {
//       throw new BadRequestError("A valid email is required");
//     }

//     if (user) {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         const otpExpiresIn = addHoursToDate(new Date(), 1);

//         const newUpdate = {
//           ...user,
//           otp,
//           otpExpiresIn,
//         };

//         const result = User.updateOneByPassword(newUpdate);

//         if(result && result.code === 404) {
//             throw createCustomError("User does not exist", 404)
//         }

//         if(result) {
//           new Mail(newUpdate.staff_email).sendMail("FORGET_PASSWORD", {
//             subject: "RESET PASSWORD",
//             data: {
//               name: newUpdate.staff_name,
//               otp: otp,
//               id: user.id,
//             },
//           });

//           res.status(200).json({
//             message: "OTP Sent Successfully.",
//             data: {
//               id: newUpdate.id,
//               email: newUpdate.staff_email,
//             },
//             success: 1,
//           });
//         }
//     }

//   } catch (error) {
//     throw error;
//   }
// });

// export const verifyResetOtp = asyncWrapper(async (req, res) => {

//   const { id, otp, pass_word } = req.body;

//   if(!(otp && id)) {
//     throw new BadRequestError('OTP code and user id required')
//   }

//   try {

//     const user = await User.findOneById(id)
//    console.log('Found user: ', user)
//     if(user.code && user.code === 404) {

//       throw createCustomError(`No user with id: ${id}`, 404)

//     } else if(user && user.otp !== (otp * 1)) {

//       throw new BadRequestError("Invalid OTP Pin received");

//     } else if (user && new Date(user.otpExpiresIn) < new Date()) {

//       throw new BadRequestError("OTP Pin expired");

//     } else {

//       const hashed = generateHashString(pass_word);

//       hashed.then((hashedPassword) => {

//         const updatedUser = {
//             ...user,
//             pass_word: hashedPassword,
//             otp: 0,
//             otpExpiresIn: addHoursToDate(new Date(), 0.5),
//         };


//         const newUser = User.updateOneByPassword(updatedUser);
//         console.log('Reset: ', newUser)
          
//         if(newUser.code && newUser.code === 404) {
//             throw new BadRequestError('User does not exist')
//         }

//         if (newUser) {
//             delete newUser.pass_word;
//             delete newUser.otp;
//             delete newUser.otpExpiresIn;
//             delete newUser.otpVerificationId

                
//             res.status(200).json({
//               message: "Password Updated Successfully",
//               data: newUser,
//               success: 1,
//             });
//         }
//     });
//     }
//   } catch (error) {
//     throw error;
//   }
// });

class AuthController {

  constructor() {
    this.authService = new AuthService()
  }

  login = asyncWrapper(async (req, res) => {

    try {

      const user = await this.authService.signIn(req.body)

      if (user) {

        res.status(200).json({
          message: "Login Successful",
          data: user,
          success: 1,
        });

      } else {

        throw new BadRequestError("Invalid credentials");

      }
    } catch (error) {

      throw error

    }
  })

  requestOtp = asyncWrapper(async (req, res) => {

    try {

      const { staff_email } = req.body

      const user = await this.authService.requestOtp(staff_email)

      if(user) {
        new Mail(user.staff_email).sendMail("FORGET_PASSWORD", {
          subject: "RESET PASSWORD",
          data: {
            name: user.staff_name,
            otp: user.otp,
            id: user.id,
          },
        });

        res.status(200).json({
          message: "OTP Sent Successfully.",
          data: {
            id: user.id,
            email: user.staff_email,
          },
          success: 1,
        });
      }

    } catch (error) {

      throw error

    }
  })

  verifyOtp = asyncWrapper(async (req, res) => {

    const { id, otp, pass_word } = req.body;

    if(!(otp && id)) {

      throw new BadRequestError('OTP code and user id required')

    }

    const user = await this.authService.verifyOTP(id, otp, pass_word)

    if (user) {
      delete user.pass_word
      delete user.otp;
      delete user.otpExpiresIn;

      res.status(200).json({
        message: "Password Updated Successfully",
        data: user,
        success: 1,
      });
    }

  })

}
export default AuthController;