import { API_URL } from "../config/api";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user: AppUser;
}

// Error de la API con el mismo formato que devuelve el backend
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que esté encendido y que estés en la misma red Wi-Fi.",
      "NETWORK_ERROR"
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.error?.message ?? "Ocurrió un error inesperado",
      data?.error?.code,
      data?.error?.details
    );
  }

  return data as T;
}

export async function registerUser(input: RegisterInput): Promise<AppUser> {
  const data = await request<{ user: AppUser }>("/users/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.user;
}

export function loginUser(input: LoginInput): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getProfile(token: string): Promise<AppUser> {
  const data = await request<{ user: AppUser }>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}
