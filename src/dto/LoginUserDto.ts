import { ValidationError } from "../exceptions/errors";

export interface LoginUserDto {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    throw new ValidationError(errors);
  }

  return { email, password };
}
