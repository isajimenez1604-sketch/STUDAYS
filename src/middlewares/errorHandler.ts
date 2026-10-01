import { NextFunction, Request, Response } from "express";

import { AppError, NotFoundError } from "../exceptions/errors";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError("Ruta no encontrada"));
}

// Debe registrarse al final, después de todas las rutas
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  // JSON mal formado en el body
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: { code: "INVALID_JSON", message: "El cuerpo de la petición no es un JSON válido" },
    });
  }

  console.error("[Unhandled error]", err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" },
  });
}
