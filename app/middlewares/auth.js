import jwt from "jsonwebtoken";
import UnauthenticatedError from "../utils/errors/unauthenticated.js";
import User from "../models/User.js";
import asyncWrapper from "./async.js";

const authMiddleware = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided");

  } else {

    const token = authHeader.split(" ")[1];

    if (token) {
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id, email } = decoded;
    
      await User.selectAdmin(email, (err, user) => {
        if (err && err.kind === 'not_found') {
          // throw new UnauthenticatedError("Not authorized to access this route");
          res.status(401).json({
            message: "Not authorized to access this route.",
            success: 0,
          });
        }

        if (user) {

          req.user = {
            id,
            email,
            role: user[0].role,
          };
        }
    
        return next();
      });
    }
  }

});

export default authMiddleware;
