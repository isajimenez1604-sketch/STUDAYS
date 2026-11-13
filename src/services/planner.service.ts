import { PlannerInterval } from "../data/models/planner.model";
import {
  CreatePlannerIntervalDto,
  UpdatePlannerIntervalDto,
} from "../dto/planner.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IPlannerRepository } from "../repositories/interfaces/planner.repository.interface";
import { IPlannerService } from "./interfaces/planner.interface";

const MAX_INTERVALS_PER_USER = 50;

export class PlannerService implements IPlannerService {
  private readonly plannerRepository: IPlannerRepository;

  constructor({
    plannerRepository,
  }: {
    plannerRepository: IPlannerRepository;
  }) {
    this.plannerRepository = plannerRepository;
  }

  findByUserId(userId: number): Promise<PlannerInterval[]> {
    return this.plannerRepository.findByUserId(userId);
  }

  async create(input: CreatePlannerIntervalDto): Promise<PlannerInterval> {
    const intervals = await this.plannerRepository.findByUserId(input.userId);
    if (intervals.length >= MAX_INTERVALS_PER_USER) {
      throw AppError.validation({
        intervals: `Puedes guardar hasta ${MAX_INTERVALS_PER_USER} intervalos`,
      });
    }
    return this.plannerRepository.create(input);
  }

  async update(
    userId: number,
    intervalId: number,
    changes: UpdatePlannerIntervalDto
  ): Promise<PlannerInterval> {
    const updated = await this.plannerRepository.updateById(
      userId,
      intervalId,
      changes
    );
    if (!updated) throw AppError.plannerIntervalNotFound();
    return updated;
  }

  async delete(userId: number, intervalId: number): Promise<void> {
    const deleted = await this.plannerRepository.deleteById(userId, intervalId);
    if (!deleted) throw AppError.plannerIntervalNotFound();
  }
}
