import { error, success } from "../helpers/response.js";
import { constants } from "../base/request.js";

const fetch = async (req, res) => {
    try {
        return success(res, 200, constants[req.query.value]);
    } catch (err) {
        return error(res, 500, err);
    }
};

export { fetch };
