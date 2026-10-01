import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(details: Record<string, string>, message = "Datos inválidos") {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}
