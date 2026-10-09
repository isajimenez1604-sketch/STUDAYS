import { Task } from "../../data/models/task.model";
import { CreateTaskDto } from "../../dto/task.dto";

export interface ITaskService {
  create(dto: CreateTaskDto): Promise<Task>;
}
