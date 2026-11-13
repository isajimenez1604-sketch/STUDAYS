import { API_URL } from "../config/api";
import { getAccessToken } from "./currentUser";

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
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface LoginResponse {
  user: AppUser;
  accessToken: string;
  expiresIn: number;
}

export interface AppTask {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  created_at: string;
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";
export type EditableTaskStatus = Exclude<TaskStatus, "overdue">;

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: EditableTaskStatus;
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
    const token = getAccessToken();
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
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
      data?.message ?? "Ocurrió un error inesperado",
      data?.code,
      data?.details
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

export async function listTasks(): Promise<AppTask[]> {
  const data = await request<{ tasks: AppTask[] }>("/tasks");
  return data.tasks;
}

export async function createTask(input: CreateTaskInput): Promise<AppTask> {
  const data = await request<{ task: AppTask }>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.task;
}

export async function updateTask(
  taskId: number,
  changes: UpdateTaskInput
): Promise<AppTask> {
  const data = await request<{ task: AppTask }>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
  return data.task;
}

export async function deleteTask(taskId: number): Promise<void> {
  await request<void>(`/tasks/${taskId}`, { method: "DELETE" });
}

export async function requestPasswordReset(email: string): Promise<string> {
  const data = await request<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return data.message;
}

export async function resetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<string> {
  const data = await request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.message;
}
