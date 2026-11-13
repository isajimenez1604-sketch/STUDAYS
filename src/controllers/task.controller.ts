import { NextFunction, Request, Response } from "express";

import {
  parseCreateTaskDto,
  parseTaskId,
  parseUpdateTaskDto,
} from "../dto/task.dto";
import { AppError } from "../exceptions/errors/app.error";
import { ITaskService } from "../services/interfaces/task.interface";

function authenticatedUserId(req: Request): number {
  if (!req.authenticatedUserId) throw AppError.unauthorized();
  return req.authenticatedUserId;
}

export class TaskController {
  private readonly taskService: ITaskService;

  constructor({ taskService }: { taskService: ITaskService }) {
    this.taskService = taskService;
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = authenticatedUserId(req);
      const tasks = await this.taskService.findByUserId(userId);
      res.json({ tasks });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseCreateTaskDto(req.body, authenticatedUserId(req));
      const task = await this.taskService.create(dto);
      res.status(201).json({ message: "Tarea creada", task });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = authenticatedUserId(req);
      const dto = parseUpdateTaskDto(req.body, req.params.taskId);
      const task = await this.taskService.update(userId, dto);
      res.json({ message: "Tarea actualizada", task });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = authenticatedUserId(req);
      const taskId = parseTaskId(req.params.taskId);
      await this.taskService.delete(userId, taskId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
