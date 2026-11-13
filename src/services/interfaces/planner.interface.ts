import { PlannerInterval } from "../../data/models/planner.model";
import {
  CreatePlannerIntervalDto,
  UpdatePlannerIntervalDto,
} from "../../dto/planner.dto";

export interface IPlannerService {
  findByUserId(userId: number): Promise<PlannerInterval[]>;
  create(input: CreatePlannerIntervalDto): Promise<PlannerInterval>;
  update(
    userId: number,
    intervalId: number,
    changes: UpdatePlannerIntervalDto
  ): Promise<PlannerInterval>;
  delete(userId: number, intervalId: number): Promise<void>;
}
