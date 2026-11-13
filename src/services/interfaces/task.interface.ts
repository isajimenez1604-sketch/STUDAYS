import { Task } from "../../data/models/task.model";
import { CreateTaskDto, UpdateTaskDto } from "../../dto/task.dto";

export interface ITaskService {
  findByUserId(userId: number): Promise<Task[]>;
  create(dto: CreateTaskDto): Promise<Task>;
  update(userId: number, dto: UpdateTaskDto): Promise<Task>;
  delete(userId: number, taskId: number): Promise<void>;
}
