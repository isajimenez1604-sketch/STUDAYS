import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message = "El recurso ya existe") {
    super(message, 409, "CONFLICT");
  }
}
