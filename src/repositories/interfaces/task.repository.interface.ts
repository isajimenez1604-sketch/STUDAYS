import { Task } from "../../data/models/task.model";
import { UpdateTaskDto } from "../../dto/task.dto";

export interface ITaskRepository {
  findByUserId(userId: number): Promise<Task[]>;
  create(task: {
    userId: number;
    title: string;
    description: string | null;
    dueDate: string | null;
  }): Promise<Task>;
  updateById(
    userId: number,
    taskId: number,
    input: Omit<UpdateTaskDto, "taskId">
  ): Promise<Task>;
  deleteById(userId: number, taskId: number): Promise<void>;
}
