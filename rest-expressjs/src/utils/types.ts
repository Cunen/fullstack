import type { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  errorMessage?: string;
  errorStatus?: number;
}
