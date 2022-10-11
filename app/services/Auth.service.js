import jwt from "jsonwebtoken";
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
            { id: user.staff_id, email: user.staff_email, dept: user.department },
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

            } else {
                return null
            }

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
}

export default AuthService;