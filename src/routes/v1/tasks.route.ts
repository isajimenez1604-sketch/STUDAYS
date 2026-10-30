import { Router } from "express";

import { container } from "../../config/container";
import { TaskController } from "../../controllers/task.controller";

const router = Router();

// GET /api/v1/tasks?userId=1
router.get("/", async (req, res, next) => {
  const controller = container.resolve<TaskController>("taskController");
  return controller.list(req, res, next);
});

// POST /api/v1/tasks
router.post("/", async (req, res, next) => {
  const controller = container.resolve<TaskController>("taskController");
  return controller.create(req, res, next);
});

export default router;
