import { AppError } from "../exceptions/errors/app.error";

export interface CreateTaskDto {
  userId: number;
  title: string;
  description: string | null;
  dueDate: string | null;
}

export function parseCreateTaskDto(body: unknown): CreateTaskDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const userId = typeof data.userId === "number" ? data.userId : Number.NaN;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const dueDate = typeof data.dueDate === "string" ? data.dueDate.trim() : "";

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    errors.userId = "Debe ser un ID de usuario entero positivo";
  }
  if (title.length === 0 || title.length > 120) {
    errors.title = "El título es obligatorio y debe tener máximo 120 caracteres";
  }
  if (
    data.description !== undefined &&
    data.description !== null &&
    typeof data.description !== "string"
  ) {
    errors.description = "La descripción debe ser un texto";
  } else if (description.length > 1000) {
    errors.description = "La descripción debe tener máximo 1000 caracteres";
  }
  if (
    data.dueDate !== undefined &&
    data.dueDate !== null &&
    (typeof data.dueDate !== "string" ||
      dueDate.length === 0 ||
      Number.isNaN(Date.parse(dueDate)))
  ) {
    errors.dueDate = "La fecha límite debe ser una fecha válida";
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return {
    userId,
    title,
    description: description || null,
    dueDate: dueDate || null,
  };
}
