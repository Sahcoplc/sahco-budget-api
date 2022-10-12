import jwt from "jsonwebtoken";
import { addHoursToDate } from "../utils/dateFunctions.js";
import { createCustomError } from "../utils/customError.js";
import { comparePassword } from "../utils/decrypt.js";
import { generateHashString } from "../utils/encrypt.js";
import BadRequest from "../utils/errors/badRequest.js";
import UsersService from "./User.service.js";

/**
 * @class AuthService
 * @roperty payload - Creates token
 * @property signIn - Verifies a user 
 * @property signUp
 */
class AuthService {

    constructor() {
        this.userService = new UsersService()
    }

    payload = (user) => {

        const token = jwt.sign(
            { id: user.id, email: user.staff_email, dept: user.department },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
              issuer: "SAHCO PLC",
            }
        );
        
        delete user.pass_word;
        return { user, token: token };

    }

    signIn = async (user) => {

        try {

            const found = await this.userService.findEmail(user.staff_email)

            if(!found) {

                throw createCustomError('User does not exist', 404)
            }

            const password = await comparePassword(user.pass_word, found.pass_word);

            if(password) {
                const data = this.payload(found);

                delete data.user.otp;
                delete data.user.otpExpiresIn;

                return data

            }

            return null

        } catch (error) {

            throw error
        }
    }

    signUp = async (user) => {

        try {

            const found = await this.userService.findEmail(user.staff_email)
            
            if(found) {

                throw new BadRequest('An account already exists with this email')
            }

            const hashed = await generateHashString(user.pass_word);

            const newUser = {
                ...user,
                pass_word: hashed
            }

            const createdUser = await this.userService.create(newUser)

            return createdUser;

        } catch (error) {

            throw error

        }
    }

    requestOtp = async (email) => {

        try {
           
            const found = await this.userService.findEmail(email)

            if(found) {

                const otp = Math.floor(100000 + Math.random() * 900000);
                const otpExpiresIn = addHoursToDate(new Date(), 1);

                const newUpdate = {
                    ...found,
                    otp,
                    otpExpiresIn,
                };

                const user = await this.userService.updateOne(found.id, newUpdate)

                return user
            }

            throw createCustomError('User does not exist', 404)

        } catch (error) {

            throw error
        }
    }

    verifyOTP = async (id, otp, pass_word) => {

        try {
            
            const found = await this.userService.findOne(id)

            if(!found) {

                throw createCustomError(`No user with id: ${id}`, 404)

            } else if(found && found.otp !== parseInt(otp)) {

                throw new BadRequest("Invalid OTP Pin received");

            } else if (found && new Date(found.otpExpiresIn) < new Date()) {

                throw new BadRequest("OTP Pin expired");
        
            } else {

                const hashed = await generateHashString(pass_word);

                const updatedUser = {
                    ...found,
                    pass_word: hashed,
                    otp: 0,
                    otpExpiresIn: addHoursToDate(new Date(), 0.5),
                };

                const user = await this.userService.updateOne(found.id, updatedUser)

                return user;
            }

        } catch (error) {

            throw error

        }
    }
}

export default AuthService;