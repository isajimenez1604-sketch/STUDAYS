import { NextFunction, Request, Response } from "express";

import { AppException } from "../exceptions/app.exception";
import { AppError } from "../exceptions/errors/app.error";

export const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(AppError.routeNotFound());
};

// Debe registrarse al final, después de todas las rutas
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppException) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  // JSON mal formado en el body
  if (err instanceof SyntaxError && "body" in err) {
    const invalid = AppError.invalidJson();
    res.status(invalid.statusCode).json({
      code: invalid.code,
      message: invalid.message,
    });
    return;
  }

  console.error("[Unhandled error]", err);
  const internal = AppError.internal();
  res.status(internal.statusCode).json({
    code: internal.code,
    message: internal.message,
  });
};
