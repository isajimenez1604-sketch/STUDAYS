import { Task } from "../../data/models/task.model";

export interface ITaskRepository {
  create(task: {
    userId: number;
    title: string;
    description: string | null;
    dueDate: string | null;
  }): Promise<Task>;
}
