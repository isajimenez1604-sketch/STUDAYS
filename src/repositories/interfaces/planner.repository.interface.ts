import {
  PlannerInterval,
} from "../../data/models/planner.model";
import {
  CreatePlannerIntervalDto,
  UpdatePlannerIntervalDto,
} from "../../dto/planner.dto";

export interface IPlannerRepository {
  findByUserId(userId: number): Promise<PlannerInterval[]>;
  create(input: CreatePlannerIntervalDto): Promise<PlannerInterval>;
  updateById(
    userId: number,
    intervalId: number,
    changes: UpdatePlannerIntervalDto
  ): Promise<PlannerInterval | null>;
  deleteById(userId: number, intervalId: number): Promise<boolean>;
}
