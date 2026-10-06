import { type Request, type Response, type NextFunction } from "express";
import { DuplicateEmailError } from "../errors/user.errors.js";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof DuplicateEmailError) {
    return res.status(409).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Something went wrong",
  });
  
}
