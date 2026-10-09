import { Task } from "../data/models/task.model";
import { CreateTaskDto } from "../dto/task.dto";
import { ITaskRepository } from "../repositories/interfaces/task.repository.interface";
import { ITaskService } from "./interfaces/task.interface";

export class TaskService implements ITaskService {
  private readonly taskRepository: ITaskRepository;

  constructor({ taskRepository }: { taskRepository: ITaskRepository }) {
    this.taskRepository = taskRepository;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create(dto);
  }
}
