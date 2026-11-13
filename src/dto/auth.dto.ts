import { AppError } from "../exceptions/errors/app.error";

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RequestPasswordResetDto {
  email: string;
}

export interface ResetPasswordDto extends RequestPasswordResetDto {
  code: string;
  newPassword: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

function parseEmail(value: unknown): string {
  const email =
    typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!EMAIL_REGEX.test(email)) {
    throw AppError.validation({ email: "El correo electrónico no es válido" });
  }
  return email;
}

export function parseRequestPasswordResetDto(
  body: unknown
): RequestPasswordResetDto {
  const data = (body ?? {}) as Record<string, unknown>;
  return { email: parseEmail(data.email) };
}

export function parseResetPasswordDto(body: unknown): ResetPasswordDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const email = parseEmail(data.email);
  const code = typeof data.code === "string" ? data.code.trim() : "";
  const newPassword =
    typeof data.newPassword === "string" ? data.newPassword : "";
  const errors: Record<string, string> = {};

  if (!/^\d{6}$/.test(code)) {
    errors.code = "El código debe tener 6 dígitos";
  }
  if (newPassword.length < 8) {
    errors.newPassword = "La contraseña debe tener al menos 8 caracteres";
  }
  if (Object.keys(errors).length > 0) throw AppError.validation(errors);

  return { email, code, newPassword };
}

export function parseLoginDto(body: unknown): LoginUserDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!EMAIL_REGEX.test(email)) {
    errors.email = "El correo electrónico no es válido";
  }
  if (password.length === 0) {
    errors.password = "La contraseña es obligatoria";
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return { email, password };
}
