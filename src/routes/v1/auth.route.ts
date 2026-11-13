import { Router } from "express";

import { container } from "../../config/container";
import { AuthController } from "../../controllers/auth.controller";
import { loginRateLimit, passwordResetRateLimit } from "../../middlewares/rate-limit.middleware";

const router = Router();

// POST /api/v1/auth/login
router.post("/login", loginRateLimit, async (req, res, next) => {
  const controller = container.resolve<AuthController>("authController");
  return controller.login(req, res, next);
});

// POST /api/v1/auth/forgot-password
router.post("/forgot-password", passwordResetRateLimit, async (req, res, next) => {
  const controller = container.resolve<AuthController>("authController");
  return controller.requestPasswordReset(req, res, next);
});

// POST /api/v1/auth/reset-password
router.post("/reset-password", passwordResetRateLimit, async (req, res, next) => {
  const controller = container.resolve<AuthController>("authController");
  return controller.resetPassword(req, res, next);
});

export default router;
