import { AppError } from "../exceptions/errors/app.error";
import { PlannerIntervalKind } from "../data/models/planner.model";

export interface CreatePlannerIntervalDto {
  userId: number;
  title: string;
  durationMinutes: number;
  kind: PlannerIntervalKind;
}

export interface UpdatePlannerIntervalDto {
  title?: string;
  durationMinutes?: number;
  kind?: PlannerIntervalKind;
}

function asRecord(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw AppError.validation({ body: "Debe ser un objeto JSON" });
  }
  return body as Record<string, unknown>;
}

function parseFields(body: unknown): UpdatePlannerIntervalDto {
  const data = asRecord(body);
  const errors: Record<string, string> = {};
  const result: UpdatePlannerIntervalDto = {};

  if ("title" in data) {
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (title.length < 1 || title.length > 80) {
      errors.title = "El título es obligatorio y debe tener máximo 80 caracteres";
    } else {
      result.title = title;
    }
  }

  if ("durationMinutes" in data) {
    const duration = data.durationMinutes;
    if (
      typeof duration !== "number" ||
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 240
    ) {
      errors.durationMinutes = "El tiempo debe ser un entero entre 1 y 240 minutos";
    } else {
      result.durationMinutes = duration;
    }
  }

  if ("kind" in data) {
    if (data.kind !== "study" && data.kind !== "break") {
      errors.kind = "El tipo debe ser study o break";
    } else {
      result.kind = data.kind;
    }
  }

  if (Object.keys(errors).length > 0) throw AppError.validation(errors);
  return result;
}

export function parseCreatePlannerIntervalDto(
  body: unknown,
  userId: number
): CreatePlannerIntervalDto {
  const data = asRecord(body);
  const fields = parseFields(data);
  const errors: Record<string, string> = {};

  if ("userId" in data) {
    errors.userId = "La identidad se obtiene de la sesión";
  }
  if (fields.title === undefined) errors.title = "El título es obligatorio";
  if (fields.durationMinutes === undefined) {
    errors.durationMinutes = "El tiempo es obligatorio";
  }
  if (fields.kind === undefined) errors.kind = "El tipo es obligatorio";
  if (Object.keys(errors).length > 0) throw AppError.validation(errors);

  return {
    userId,
    title: fields.title!,
    durationMinutes: fields.durationMinutes!,
    kind: fields.kind!,
  };
}

export function parseUpdatePlannerIntervalDto(
  body: unknown,
  intervalIdValue: string | string[]
): { intervalId: number; changes: UpdatePlannerIntervalDto } {
  const intervalId = Array.isArray(intervalIdValue)
    ? Number.NaN
    : Number(intervalIdValue);
  if (!Number.isSafeInteger(intervalId) || intervalId <= 0) {
    throw AppError.validation({ intervalId: "Debe ser un ID entero positivo" });
  }
  const data = asRecord(body);
  const changes = parseFields(data);
  if (Object.keys(changes).length === 0) {
    throw AppError.validation({ body: "Indica al menos un campo para actualizar" });
  }
  if ("userId" in data) {
    throw AppError.validation({ userId: "La identidad se obtiene de la sesión" });
  }
  return { intervalId, changes };
}

export function parsePlannerIntervalId(value: string | string[]): number {
  const intervalId = Array.isArray(value) ? Number.NaN : Number(value);
  if (!Number.isSafeInteger(intervalId) || intervalId <= 0) {
    throw AppError.validation({ intervalId: "Debe ser un ID entero positivo" });
  }
  return intervalId;
}
