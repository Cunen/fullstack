import { validationResult } from "express-validator";
import type { Request, Response } from "express";

export const runValidation = (req: Request, res: Response) => {
  const errors = validationResult(req);
  const errArray = !errors.isEmpty() ? errors.array() : [];
  if (errArray.length > 0) {
    return {
      message: "Validation failed",
      fields: errArray.map((err) => err.type),
      summary: errArray.map((err) => err.type + ": " + err.msg).join(", "),
    };
  }
  return null;
};
