
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

export function parseCreateForumPostDto(
  body: unknown
): CreateForumPostDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const userId =
    typeof data.userId === "number" ? data.userId : Number.NaN;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const content =
    typeof data.content === "string" ? data.content.trim() : "";

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    errors.userId = "Debe ser un ID de usuario entero positivo";
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
  postId: number
): CreateForumCommentDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const userId =
    typeof data.userId === "number" ? data.userId : Number.NaN;
  const content =
    typeof data.content === "string" ? data.content.trim() : "";

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    errors.userId = "Debe ser un ID de usuario entero positivo";
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
