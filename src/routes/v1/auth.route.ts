import { Router } from "express";

import { container } from "../../config/container";
import { AuthController } from "../../controllers/auth.controller";

const router = Router();

// POST /api/v1/auth/login
router.post("/login", async (req, res, next) => {
  const controller = container.resolve<AuthController>("authController");
  return controller.login(req, res, next);
});

export default router;
