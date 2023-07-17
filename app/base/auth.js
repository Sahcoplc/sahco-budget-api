import jwt from "jsonwebtoken";
import asyncWrapper from "../middlewares/async.js";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import { getEmployee, getPermission } from "../helpers/fetch.js";
import { createCustomError } from "../utils/errors/customError.js";
import { openRoutes } from "./request.js";

const authMiddleware = asyncWrapper(async (req, res, next) => {
  try {
    const isOpenRoute = openRoutes.some((route) => req.method === route.method && req.originalUrl === route.path);
    if (isOpenRoute) return next();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("You are not logged in");
    }

    const token = authHeader.split(" ")[1];

    if(!token) throw new UnauthenticatedError("You are not logged in");

    const { _id, email, staffId } = jwt.verify(token, process.env.JWT_SECRET);

    const { data, success } = await getEmployee(_id, token);
    const { data: permissions } = await getPermission(_id, token)

    if (!success) {
      throw new UnauthenticatedError("Not authorized to access this route");
    }

    req.user = {
      _id,
      fullName: data.fullName,
      email,
      staffId,
      department: data.department,
      currentStation: data.currentStation,
      permissions,
      subDept: data.subDept,
      jobTitle: data.jobTitle
    };

    return next()

  } catch (err) {
    console.log('AUTH ERR::: ', err)
    throw createCustomError(err?.message || 'Network Error', err?.statusCode)
  }
});

export default authMiddleware;
