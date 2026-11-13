import { supabase } from "../config/supabase";
import {
  PLANNER_INTERVALS_TABLE,
  PlannerInterval,
} from "../data/models/planner.model";
import {
  CreatePlannerIntervalDto,
  UpdatePlannerIntervalDto,
} from "../dto/planner.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IPlannerRepository } from "./interfaces/planner.repository.interface";

const COLUMNS = "id, user_id, title, duration_minutes, kind, created_at";

export class PlannerRepository implements IPlannerRepository {
  async findByUserId(userId: number): Promise<PlannerInterval[]> {
    const { data, error } = await supabase
      .from(PLANNER_INTERVALS_TABLE)
      .select(COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("[PlannerRepository.findByUserId]", error);
      throw AppError.database();
    }
    return (data ?? []) as PlannerInterval[];
  }

  async create(input: CreatePlannerIntervalDto): Promise<PlannerInterval> {
    const { data, error } = await supabase
      .from(PLANNER_INTERVALS_TABLE)
      .insert({
        user_id: input.userId,
        title: input.title,
        duration_minutes: input.durationMinutes,
        kind: input.kind,
      })
      .select(COLUMNS)
      .single();

    if (error) {
      if (error.code === "23503") throw AppError.userNotFound();
      console.error("[PlannerRepository.create]", error);
      throw AppError.database();
    }
    return data as PlannerInterval;
  }

  async updateById(
    userId: number,
    intervalId: number,
    changes: UpdatePlannerIntervalDto
  ): Promise<PlannerInterval | null> {
    const updates: {
      title?: string;
      duration_minutes?: number;
      kind?: "study" | "break";
    } = {};
    if (changes.title !== undefined) updates.title = changes.title;
    if (changes.durationMinutes !== undefined) {
      updates.duration_minutes = changes.durationMinutes;
    }
    if (changes.kind !== undefined) updates.kind = changes.kind;

    const { data, error } = await supabase
      .from(PLANNER_INTERVALS_TABLE)
      .update(updates)
      .eq("id", intervalId)
      .eq("user_id", userId)
      .select(COLUMNS)
      .maybeSingle();

    if (error) {
      console.error("[PlannerRepository.updateById]", error);
      throw AppError.database();
    }
    return data as PlannerInterval | null;
  }

  async deleteById(userId: number, intervalId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from(PLANNER_INTERVALS_TABLE)
      .delete()
      .eq("id", intervalId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[PlannerRepository.deleteById]", error);
      throw AppError.database();
    }
    return data !== null;
  }
}
