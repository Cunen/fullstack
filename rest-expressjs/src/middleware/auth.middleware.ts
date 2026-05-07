import type { Response, NextFunction } from "express";
import dotenv from "dotenv";
import process from "process";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../utils/types.js";

dotenv.config({ path: ".env.local" });

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    return res.status(403).json({ message: "Missing authorization header!" });
  }

  if (!secretKey) {
    return res.status(500).json({ message: "Server configuration error!" });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    // Store user ID in request object for later use
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};
