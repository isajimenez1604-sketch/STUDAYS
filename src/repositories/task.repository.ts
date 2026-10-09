import { supabase } from "../config/supabase";
import { TASKS_TABLE, Task } from "../data/models/task.model";
import { AppError } from "../exceptions/errors/app.error";
import { ITaskRepository } from "./interfaces/task.repository.interface";

const TASK_COLUMNS =
  "id, user_id, title, description, due_date, status, created_at";

export class TaskRepository implements ITaskRepository {
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
}
