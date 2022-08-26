import bcrypt from "bcrypt";

export const generateHashString = async (password) => {
    return await bcrypt.hash(password, await bcrypt.genSalt());
};