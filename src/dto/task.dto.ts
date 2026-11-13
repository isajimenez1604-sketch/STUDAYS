import { AppError } from "../exceptions/errors/app.error";

export const TASK_STATUSES = [
  "pending",
  "in_progress",
  "completed",
] as const;
export type EditableTaskStatus = (typeof TASK_STATUSES)[number];

export interface CreateTaskDto {
  userId: number;
  title: string;
  description: string | null;
  dueDate: string | null;
}

export interface UpdateTaskDto {
  taskId: number;
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: EditableTaskStatus;
}

function parseDate(value: unknown, errors: Record<string, string>): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    errors.dueDate = "La fecha límite debe ser una fecha válida";
    return null;
  }
  return value;
}

export function parseTaskId(value: unknown): number {
  const taskId =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : Number.NaN;

  if (!Number.isSafeInteger(taskId) || taskId <= 0) {
    throw AppError.validation({
      taskId: "Debe ser un ID de tarea entero positivo",
    });
  }

  return taskId;
}

export function parseCreateTaskDto(
  body: unknown,
  userId: number
): CreateTaskDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";

  if (data.userId !== undefined) {
    errors.userId = "La identidad del usuario se obtiene de la sesión";
  }
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw AppError.unauthorized();
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
  const parsedDueDate = parseDate(data.dueDate, errors);

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return {
    userId,
    title,
    description: description || null,
    dueDate: parsedDueDate,
  };
}

export function parseUpdateTaskDto(
  body: unknown,
  taskIdValue: unknown
): UpdateTaskDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const taskId = parseTaskId(taskIdValue);
  const changes: Omit<UpdateTaskDto, "taskId"> = {};

  if (data.userId !== undefined) {
    errors.userId = "La identidad del usuario se obtiene de la sesión";
  }

  if (data.title !== undefined) {
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (!title || title.length > 120) {
      errors.title = "El título es obligatorio y debe tener máximo 120 caracteres";
    } else {
      changes.title = title;
    }
  }

  if (data.description !== undefined) {
    if (data.description !== null && typeof data.description !== "string") {
      errors.description = "La descripción debe ser un texto";
    } else {
      const description =
        typeof data.description === "string" ? data.description.trim() : null;
      if (description && description.length > 1000) {
        errors.description = "La descripción debe tener máximo 1000 caracteres";
      } else {
        changes.description = description || null;
      }
    }
  }

  if (data.dueDate !== undefined) {
    changes.dueDate = parseDate(data.dueDate, errors);
  }

  if (data.status !== undefined) {
    if (
      typeof data.status !== "string" ||
      !TASK_STATUSES.includes(data.status as EditableTaskStatus)
    ) {
      errors.status =
        "El estado debe ser pending, in_progress o completed";
    } else {
      changes.status = data.status as EditableTaskStatus;
    }
  }

  if (Object.keys(changes).length === 0 && Object.keys(errors).length === 0) {
    errors.task = "Debes enviar al menos un campo para actualizar";
  }
  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return { taskId, ...changes };
}
