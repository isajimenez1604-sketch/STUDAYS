import { NextFunction, Request, Response } from "express";
import {
  parseCreatePlannerIntervalDto,
  parsePlannerIntervalId,
  parseUpdatePlannerIntervalDto,
} from "../dto/planner.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IPlannerService } from "../services/interfaces/planner.interface";

function authenticatedUserId(req: Request): number {
  if (!req.authenticatedUserId) throw AppError.unauthorized();
  return req.authenticatedUserId;
}

export class PlannerController {
  private readonly plannerService: IPlannerService;

  constructor({ plannerService }: { plannerService: IPlannerService }) {
    this.plannerService = plannerService;
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const intervals = await this.plannerService.findByUserId(
        authenticatedUserId(req)
      );
      res.json({ intervals });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const interval = await this.plannerService.create(
        parseCreatePlannerIntervalDto(req.body, authenticatedUserId(req))
      );
      res.status(201).json({ message: "Intervalo creado", interval });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { intervalId, changes } = parseUpdatePlannerIntervalDto(
        req.body,
        req.params.intervalId
      );
      const interval = await this.plannerService.update(
        authenticatedUserId(req),
        intervalId,
        changes
      );
      res.json({ message: "Intervalo actualizado", interval });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.plannerService.delete(
        authenticatedUserId(req),
        parsePlannerIntervalId(req.params.intervalId)
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
