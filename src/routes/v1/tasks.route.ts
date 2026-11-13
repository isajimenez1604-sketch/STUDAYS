import { Router } from "express";

import { container } from "../../config/container";
import { TaskController } from "../../controllers/task.controller";
import { requireAuthentication } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuthentication);

// GET /api/v1/tasks
router.get("/", async (req, res, next) => {
  const controller = container.resolve<TaskController>("taskController");
  return controller.list(req, res, next);
});

// POST /api/v1/tasks
router.post("/", async (req, res, next) => {
  const controller = container.resolve<TaskController>("taskController");
  return controller.create(req, res, next);
});

// PATCH /api/v1/tasks/:taskId
router.patch("/:taskId", async (req, res, next) => {
  const controller = container.resolve<TaskController>("taskController");
  return controller.update(req, res, next);
});

// DELETE /api/v1/tasks/:taskId?userId=1
router.delete("/:taskId", async (req, res, next) => {
  const controller = container.resolve<TaskController>("taskController");
  return controller.delete(req, res, next);
});

export default router;
