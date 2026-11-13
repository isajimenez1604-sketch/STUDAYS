import { NextFunction, Request, Response } from "express";

import { AppError } from "../exceptions/errors/app.error";
import { getUserIdFromSessionToken } from "../services/session-token.service";

declare global {
  namespace Express {
    interface Request {
      authenticatedUserId?: number;
    }
  }
}

export function requireAuthentication(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);
  const userId = match
    ? getUserIdFromSessionToken(match[1])
    : null;

  if (!userId) {
    next(AppError.unauthorized());
    return;
  }

  req.authenticatedUserId = userId;
  next();
}
