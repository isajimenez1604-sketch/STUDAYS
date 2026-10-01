import { Router } from "express";

import { container } from "../../config/container";
import { AuthController } from "../../controllers/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// POST /api/v1/auth/login
router.post("/login", async (req, res, next) => {
  const controller = container.resolve<AuthController>("authController");
  return controller.login(req, res, next);
});

// GET /api/v1/auth/me  (requiere token)
router.get("/me", authMiddleware, async (req, res, next) => {
  const controller = container.resolve<AuthController>("authController");
  return controller.me(req, res, next);
});

export default router;
