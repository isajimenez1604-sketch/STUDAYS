import { AppException } from "../app.exception";

// Catálogo de errores de la aplicación.
// Uso: throw AppError.emailAlreadyExists();
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

unauthorized: () =>
new AppException(
"AUTHENTICATION_REQUIRED",
"Inicia sesión para continuar",
401
),

rateLimitExceeded: () =>
new AppException(
"RATE_LIMIT_EXCEEDED",
"Demasiadas solicitudes. Intenta de nuevo más tarde.",
429
),

userNotFound: () =>
new AppException("USER_NOT_FOUND", "Usuario no encontrado", 404),

taskNotFound: () =>
new AppException("TASK_NOT_FOUND", "Tarea no encontrada", 404),

emailServiceNotConfigured: () =>
new AppException(
"EMAIL_SERVICE_NOT_CONFIGURED",
"El servicio de correo no está configurado",
503
),

emailDeliveryFailed: () =>
new AppException(
"EMAIL_DELIVERY_FAILED",
"No se pudo enviar el correo. Intenta de nuevo más tarde.",
502
),

invalidPasswordResetCode: () =>
new AppException(
"INVALID_PASSWORD_RESET_CODE",
"El código es inválido o expiró. Solicita uno nuevo.",
400
),

// Errores de chats
chatNotFound: () =>
new AppException("CHAT_NOT_FOUND", "Chat no encontrado", 404),

chatOrUserNotFound: () =>
new AppException(
"CHAT_OR_USER_NOT_FOUND",
"El chat o el usuario no existe",
404
),

alreadyChatMember: () =>
new AppException(
"ALREADY_CHAT_MEMBER",
"El usuario ya pertenece a este chat",
409
),

// Errores del foro
forumPostNotFound: () =>
new AppException(
"FORUM_POST_NOT_FOUND",
"Publicación no encontrada",
404
),

forumPostOrUserNotFound: () =>
new AppException(
"FORUM_POST_OR_USER_NOT_FOUND",
"La publicación o el usuario no existe",
404
),

plannerIntervalNotFound: () =>
new AppException(
"PLANNER_INTERVAL_NOT_FOUND",
"Intervalo de planificador no encontrado",
404
),

// Errores generales
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