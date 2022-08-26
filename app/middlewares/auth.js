import jwt from "jsonwebtoken";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import User from "../models/User.js";
import asyncWrapper from "./async.js";

const authMiddleware = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { id, email } = decoded;

  const user = await User.findOne({ _id: id });
  if (!user)
    throw new UnauthenticatedError("Not authorized to access this route");

  req.user = {
    id,
    email,
    role: user.role,
  };
  return next();
});

export default authMiddleware;
