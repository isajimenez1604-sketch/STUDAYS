import { NextFunction, Request, Response } from "express";

import { parseCreateTaskDto } from "../dto/task.dto";
import { ITaskService } from "../services/interfaces/task.interface";

export class TaskController {
  private readonly taskService: ITaskService;

  constructor({ taskService }: { taskService: ITaskService }) {
    this.taskService = taskService;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseCreateTaskDto(req.body);
      const task = await this.taskService.create(dto);
      res.status(201).json({ message: "Tarea creada", task });
    } catch (error) {
      next(error);
    }
  };
}
