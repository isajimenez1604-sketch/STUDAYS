import { AppError } from "../exceptions/errors/app.error";

export interface CreateChatDto {
  userId: number;
  name: string;
}

export interface JoinChatDto {
  chatId: number;
  userId: number;
}

function isPositiveInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0
  );
}

export function parseCreateChatDto(body: unknown): CreateChatDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const name = typeof data.name === "string" ? data.name.trim() : "";

  if (!isPositiveInteger(data.userId)) {
    errors.userId = "Debe ser un ID de usuario entero positivo";
  }
  if (name.length === 0 || name.length > 100) {
    errors.name = "El nombre del chat es obligatorio y debe tener máximo 100 caracteres";
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return { userId: data.userId as number, name };
}

export function parseJoinChatDto(body: unknown): JoinChatDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  if (!isPositiveInteger(data.chatId)) {
    errors.chatId = "Debe ser un ID de chat entero positivo";
  }
  if (!isPositiveInteger(data.userId)) {
    errors.userId = "Debe ser un ID de usuario entero positivo";
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return {
    chatId: data.chatId as number,
    userId: data.userId as number,
  };
}
