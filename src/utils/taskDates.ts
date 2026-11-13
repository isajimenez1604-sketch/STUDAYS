import type { AppTask, TaskStatus } from "../services/authApi";

export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateString(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearString, monthString, dayString] = match;
  const date = new Date(Number(yearString), Number(monthString) - 1, Number(dayString));

  if (
    date.getFullYear() !== Number(yearString) ||
    date.getMonth() !== Number(monthString) - 1 ||
    date.getDate() !== Number(dayString)
  ) {
    return null;
  }

  return date;
}

export function formatDateString(value: string): string {
  const date = parseDateString(getTaskDueDateKey(value));
  if (!date) return value;
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getTaskDueDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value.slice(0, 10)
    : getLocalDateString(date);
}

export function toDueDateIso(date: Date): string {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.toISOString();
}

export function getTaskColor(
  status: TaskStatus,
  dueDate: string | null,
  now = new Date()
): string {
  if (status === "completed") return "#16A34A";
  if (status === "overdue") return "#DC2626";

  if (dueDate) {
    const due = parseDateString(getTaskDueDateKey(dueDate));
    const today = parseDateString(getLocalDateString(now));
    if (due && today) {
      const daysUntilDue = Math.round(
        (due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (daysUntilDue <= 2) return "#EA580C";
    }
  }
  if (status === "in_progress") return "#3B82F6";
  return "#64748B";
}

export function getTasksDueSoon(
  tasks: AppTask[],
  now = new Date(),
  daysAhead = 2
): AppTask[] {
  const today = parseDateString(getLocalDateString(now));
  if (!today) return [];

  return tasks
    .filter((task) => task.status !== "completed" && task.due_date)
    .filter((task) => {
      const due = parseDateString(getTaskDueDateKey(task.due_date!));
      if (!due) return false;
      const daysUntilDue = Math.round(
        (due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
      );
      return daysUntilDue <= daysAhead;
    })
    .sort(
      (left, right) =>
        getTaskDueDateKey(left.due_date!).localeCompare(
          getTaskDueDateKey(right.due_date!)
        )
    );
}

export function getDeadlineMessage(task: AppTask, now = new Date()): string {
  if (!task.due_date) return "";
  const due = parseDateString(getTaskDueDateKey(task.due_date));
  const today = parseDateString(getLocalDateString(now));
  if (!due || !today) return "";

  const difference = Math.round(
    (due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
  );
  if (difference < 0) {
    const daysOverdue = Math.abs(difference);
    return `Venció hace ${daysOverdue} ${
      daysOverdue === 1 ? "día" : "días"
    }`;
  }
  if (difference === 0) return "Vence hoy";
  if (difference === 1) return "Vence mañana";
  return `Vence en ${difference} días`;
}
