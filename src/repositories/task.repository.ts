import { supabase } from "../config/supabase";
import { TASKS_TABLE, Task } from "../data/models/task.model";
import { UpdateTaskDto } from "../dto/task.dto";
import { AppError } from "../exceptions/errors/app.error";
import { ITaskRepository } from "./interfaces/task.repository.interface";

const TASK_COLUMNS =
  "id, user_id, title, description, due_date, status, created_at";

export class TaskRepository implements ITaskRepository {
  private async refreshOverdue(userId: number): Promise<void> {
    const now = new Date().toISOString();
    const { error: overdueError } = await supabase
      .from(TASKS_TABLE)
      .update({ status: "overdue" })
      .eq("user_id", userId)
      .neq("status", "completed")
      .not("due_date", "is", null)
      .lt("due_date", now);

    if (overdueError) {
      console.error("[TaskRepository.refreshOverdue]", overdueError);
      throw AppError.database();
    }

    const { error: restoredError } = await supabase
      .from(TASKS_TABLE)
      .update({ status: "pending" })
      .eq("user_id", userId)
      .eq("status", "overdue")
      .or(`due_date.is.null,due_date.gte.${now}`);

    if (restoredError) {
      console.error("[TaskRepository.refreshOverdue]", restoredError);
      throw AppError.database();
    }
  }

  async findByUserId(userId: number): Promise<Task[]> {
    await this.refreshOverdue(userId);

    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .select(TASK_COLUMNS)
      .eq("user_id", userId)
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[TaskRepository.findByUserId]", error);
      throw AppError.database();
    }

    return data as Task[];
  }

  async create(input: {
    userId: number;
    title: string;
    description: string | null;
    dueDate: string | null;
  }): Promise<Task> {
    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .insert({
        user_id: input.userId,
        title: input.title,
        description: input.description,
        due_date: input.dueDate,
      })
      .select(TASK_COLUMNS)
      .single();

    if (error) {
      if (error.code === "23503") {
        throw AppError.userNotFound();
      }
      console.error("[TaskRepository.create]", error);
      throw AppError.database();
    }

    return data as Task;
  }

  async updateById(
    userId: number,
    taskId: number,
    input: Omit<UpdateTaskDto, "taskId">
  ): Promise<Task> {
    const updates: {
      title?: string;
      description?: string | null;
      due_date?: string | null;
      status?: string;
    } = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.dueDate !== undefined) updates.due_date = input.dueDate;
    if (input.status !== undefined) updates.status = input.status;

    const { error } = await supabase
      .from(TASKS_TABLE)
      .update(updates)
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      console.error("[TaskRepository.updateById]", error);
      throw AppError.database();
    }

    await this.refreshOverdue(userId);
    const { data, error: selectError } = await supabase
      .from(TASKS_TABLE)
      .select(TASK_COLUMNS)
      .eq("id", taskId)
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError) {
      console.error("[TaskRepository.updateById.select]", selectError);
      throw AppError.database();
    }
    if (!data) throw AppError.taskNotFound();

    return data as Task;
  }

  async deleteById(userId: number, taskId: number): Promise<void> {
    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[TaskRepository.deleteById]", error);
      throw AppError.database();
    }
    if (!data) throw AppError.taskNotFound();
  }
}
