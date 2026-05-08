import type { Response, NextFunction } from "express";
import dotenv from "dotenv";
import process from "process";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../utils/types.js";

dotenv.config({ path: ".env.local" });

export const graphqlAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization")?.split(" ")[1];
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    req.errorMessage = "Missing authorization header!";
    req.errorStatus = 403;
    return next();
  }

  if (!secretKey) {
    req.errorMessage = "Server configuration error!";
    req.errorStatus = 500;
    return next();
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    // Store user ID in request object for later use
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    req.errorMessage = "Unauthorized";
    req.errorStatus = 403;
    return next();
  }
};

export const graphqlOptionsMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
};
