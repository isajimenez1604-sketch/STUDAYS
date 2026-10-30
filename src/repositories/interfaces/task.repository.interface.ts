import { Task } from "../../data/models/task.model";

export interface ITaskRepository {
  findByUserId(userId: number): Promise<Task[]>;
  create(task: {
    userId: number;
    title: string;
    description: string | null;
    dueDate: string | null;
  }): Promise<Task>;
}
