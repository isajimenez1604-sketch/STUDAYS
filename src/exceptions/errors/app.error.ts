import { AppException } from "../app.exception";

// Catálogo de errores de la aplicación.
// Uso:  throw AppError.emailAlreadyExists();
export const AppError = {
  validation: (details: Record<string, string>) =>
    new AppException("VALIDATION_ERROR", "Datos inválidos", 400, details),

  invalidJson: () =>
    new AppException(
      "INVALID_JSON",
      "El cuerpo de la petición no es un JSON válido",
      400
    ),

  emailAlreadyExists: () =>
    new AppException(
      "EMAIL_ALREADY_EXISTS",
      "El correo ya está registrado",
      409
    ),

  invalidCredentials: () =>
    new AppException(
      "INVALID_CREDENTIALS",
      "Correo o contraseña incorrectos",
      401
    ),

  userNotFound: () =>
    new AppException("USER_NOT_FOUND", "Usuario no encontrado", 404),

  routeNotFound: () =>
    new AppException("ROUTE_NOT_FOUND", "Ruta no encontrada", 404),

  database: () =>
    new AppException("DATABASE_ERROR", "Error en la base de datos", 500),

  internal: () =>
    new AppException(
      "INTERNAL_SERVER_ERROR",
      "Error interno del servidor",
      500
    ),
};
