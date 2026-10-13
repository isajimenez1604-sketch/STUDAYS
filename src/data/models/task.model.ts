export const TASKS_TABLE = "tasks";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: "pending";
  created_at: string;
}
