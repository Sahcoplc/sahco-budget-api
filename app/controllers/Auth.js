import asyncWrapper from "../middlewares/async.js";
import BadRequestError from "../utils/errors/badRequest.js";
import Mail from "./mail/Mail.js";
import AuthService from "../services/Auth.service.js";

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