import { AppError } from "../exceptions/errors/app.error";

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida y normaliza el body del registro. Lanza AppException si algo falla.
export function parseRegisterDto(body: unknown): RegisterUserDto {
  const data = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password = typeof data.password === "string" ? data.password : "";
  const confirmPassword = data.confirmPassword;

  if (name.length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres";
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = "El correo electrónico no es válido";
  }
  if (password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres";
  }
  if (confirmPassword !== undefined && confirmPassword !== password) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.validation(errors);
  }

  return { name, email, password };
}
