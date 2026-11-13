import { PlannerInterval } from "../services/plannerApi";

export type TimerPhase = "idle" | "running" | "paused" | "completed";

export interface TimerState {
  phase: TimerPhase;
  intervals: PlannerInterval[];
  currentIndex: number;
  endsAt: number | null;
  remainingMs: number;
}

export const EMPTY_TIMER: TimerState = {
  phase: "idle",
  intervals: [],
  currentIndex: 0,
  endsAt: null,
  remainingMs: 0,
};

export function isTimerState(value: unknown): value is TimerState {
  if (!value || typeof value !== "object") return false;
  const timer = value as Partial<TimerState>;
  if (
    !["idle", "running", "paused", "completed"].includes(
      timer.phase as string
    ) ||
    !Array.isArray(timer.intervals) ||
    !Number.isSafeInteger(timer.currentIndex) ||
    !Number.isFinite(timer.remainingMs) ||
    (timer.remainingMs ?? -1) < 0 ||
    (timer.endsAt !== null && !Number.isFinite(timer.endsAt))
  ) {
    return false;
  }

  if (
    timer.intervals.some(
      (interval) =>
        !interval ||
        typeof interval.title !== "string" ||
        !Number.isInteger(interval.duration_minutes) ||
        interval.duration_minutes < 1 ||
        interval.duration_minutes > 240 ||
        (interval.kind !== "study" && interval.kind !== "break")
    )
  ) {
    return false;
  }

  if (timer.phase === "idle") {
    return timer.endsAt === null;
  }

  return (
    timer.intervals.length > 0 &&
    timer.currentIndex! >= 0 &&
    timer.currentIndex! < timer.intervals.length &&
    (timer.phase === "running"
      ? typeof timer.endsAt === "number" && timer.endsAt > 0
      : timer.endsAt === null)
  );
}

export function formatTime(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;
  return `${String(minutesPart).padStart(2, "0")}:${String(secondsPart).padStart(2, "0")}`;
}

export function advanceTimer(timer: TimerState, now: number): TimerState {
  if (!timer.endsAt) return timer;
  let index = timer.currentIndex;
  let endsAt = timer.endsAt;

  while (now >= endsAt) {
    index += 1;
    if (index >= timer.intervals.length) {
      return {
        ...timer,
        phase: "completed",
        currentIndex: timer.intervals.length - 1,
        endsAt: null,
        remainingMs: 0,
      };
    }
    endsAt += timer.intervals[index].duration_minutes * 60_000;
  }

  return {
    ...timer,
    currentIndex: index,
    endsAt,
    remainingMs: endsAt - now,
  };
}
