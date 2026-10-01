import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../exceptions/errors/app.error";

export interface AuthRequest extends Request {
  userId?: string;
}

// Protege rutas: exige el header  Authorization: Bearer <token>
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(AppError.tokenMissing());
  }

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as JwtPayload;
    (req as AuthRequest).userId = payload.sub;
    next();
  } catch {
    next(AppError.tokenInvalid());
  }
};
