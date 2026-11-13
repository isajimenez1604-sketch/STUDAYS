export const PLANNER_INTERVALS_TABLE = "planner_intervals";

export type PlannerIntervalKind = "study" | "break";

export interface PlannerInterval {
  id: number;
  user_id: number;
  title: string;
  duration_minutes: number;
  kind: PlannerIntervalKind;
  created_at: string;
}
