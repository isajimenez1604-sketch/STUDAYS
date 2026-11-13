
import { AppError } from "../exceptions/errors/app.error";

export interface CreateForumPostDto {
  userId: number;
  title: string;
  content: string;
}

export interface CreateForumCommentDto {
  userId: number;
  postId: number;
  content: string;
}

function asRecord(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw AppError.validation({ body: "Debe ser un objeto JSON" });
  }
  return body as Record<string, unknown>;
}

export function parseCreateForumPostDto(
  body: unknown,
  userId: number
): CreateForumPostDto {
  const data = asRecord(body);
  const errors: Record<string, string> = {};

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const content =
    typeof data.content === "string" ? data.content.trim() : "";

  if ("userId" in data) {
    errors.userId = "La identidad se obtiene de la sesión";
  }

  if (title.length === 0 || title.length > 150) {
    errors.title =
      "El título es obligatorio y debe tener máximo 150 caracteres";
  }

  if (content.length === 0 || content.length > 5000) {
    errors.content =
      "El contenido es obligatorio y debe tener máximo 5000 caracteres";
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return { userId, title, content };
}

export function parseCreateForumCommentDto(
  body: unknown,
  postId: number,
  userId: number
): CreateForumCommentDto {
  const data = asRecord(body);
  const errors: Record<string, string> = {};

  const content =
    typeof data.content === "string" ? data.content.trim() : "";

  if ("userId" in data) {
    errors.userId = "La identidad se obtiene de la sesión";
  }

  if (!Number.isSafeInteger(postId) || postId <= 0) {
    errors.postId = "Debe ser un ID de publicación entero positivo";
  }

  if (content.length === 0 || content.length > 2000) {
    errors.content =
      "El comentario es obligatorio y debe tener máximo 2000 caracteres";
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return { userId, postId, content };
}
