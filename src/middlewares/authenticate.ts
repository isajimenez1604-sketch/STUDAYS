import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";
import { UnauthorizedError } from "../exceptions/errors";

export interface AuthRequest extends Request {
  userId?: string;
}

// Protege rutas: exige el header  Authorization: Bearer <token>
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token no proporcionado"));
  }

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as JwtPayload;
    (req as AuthRequest).userId = payload.sub;
    next();
  } catch {
    next(new UnauthorizedError("Token inválido o expirado"));
  }
}
