import { Router } from "express";
import { container } from "../../config/container";
import { PlannerController } from "../../controllers/planner.controller";
import { requireAuthentication } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuthentication);

router.get("/intervals", (req, res, next) => {
  const controller = container.resolve<PlannerController>("plannerController");
  return controller.list(req, res, next);
});

router.post("/intervals", (req, res, next) => {
  const controller = container.resolve<PlannerController>("plannerController");
  return controller.create(req, res, next);
});

router.patch("/intervals/:intervalId", (req, res, next) => {
  const controller = container.resolve<PlannerController>("plannerController");
  return controller.update(req, res, next);
});

router.delete("/intervals/:intervalId", (req, res, next) => {
  const controller = container.resolve<PlannerController>("plannerController");
  return controller.delete(req, res, next);
});

export default router;
