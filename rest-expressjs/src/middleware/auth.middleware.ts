import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import process from "process";
import jwt from "jsonwebtoken";

dotenv.config({ path: ".env.local" });

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  const secretKey = process.env.JWT_SECRET;

  if (!token || !secretKey) {
    console.log("Asd");
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    // Store user ID in request object for later use
    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};
