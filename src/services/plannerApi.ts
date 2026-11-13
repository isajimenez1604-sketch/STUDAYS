import { API_URL } from "../config/api";
import { getAccessToken } from "./currentUser";

export type PlannerIntervalKind = "study" | "break";

export interface PlannerInterval {
  id: number;
  user_id: number;
  title: string;
  duration_minutes: number;
  kind: PlannerIntervalKind;
  created_at: string;
}

export interface PlannerIntervalInput {
  title: string;
  durationMinutes: number;
  kind: PlannerIntervalKind;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
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
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que esté encendido."
    );
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "No se pudo actualizar el planificador.");
  }
  return data as T;
}

export async function listPlannerIntervals(): Promise<PlannerInterval[]> {
  const data = await request<{ intervals: PlannerInterval[] }>(
    "/planner/intervals"
  );
  return data.intervals;
}

export async function createPlannerInterval(
  input: PlannerIntervalInput
): Promise<PlannerInterval> {
  const data = await request<{ interval: PlannerInterval }>(
    "/planner/intervals",
    { method: "POST", body: JSON.stringify(input) }
  );
  return data.interval;
}

export async function updatePlannerInterval(
  intervalId: number,
  input: Partial<PlannerIntervalInput>
): Promise<PlannerInterval> {
  const data = await request<{ interval: PlannerInterval }>(
    `/planner/intervals/${intervalId}`,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  return data.interval;
}

export async function deletePlannerInterval(intervalId: number): Promise<void> {
  await request<void>(`/planner/intervals/${intervalId}`, {
    method: "DELETE",
  });
}
