import { AppError } from "./AppError";

export class DatabaseError extends AppError {
  constructor(message = "Error en la base de datos") {
    super(message, 500, "DATABASE_ERROR");
  }
}
