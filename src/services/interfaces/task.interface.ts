import { Task } from "../../data/models/task.model";
import { CreateTaskDto } from "../../dto/task.dto";

export interface ITaskService {
  findByUserId(userId: number): Promise<Task[]>;
  create(dto: CreateTaskDto): Promise<Task>;
}
