import jwt from "jsonwebtoken";
import User from "../models/user.models.ts";
import asyncHandler from "../config/asynchandler.ts";


const authenticateToken = asyncHandler(async (req: any, res: any, next: any) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      // Validate JWT_SECRET
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        res.status(500);
        throw new Error("Server error: JWT_SECRET is not configured");
      }

      // Verify token with proper typing
      const decoded = jwt.verify(token, secret as string) as { userId: string };
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, Token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, Token not found");
  }
});

const authorizeAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not an admin");
  }
};

export { authenticateToken, authorizeAdmin };