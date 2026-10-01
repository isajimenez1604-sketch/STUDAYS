import { Router } from "express";

import { container } from "../../config/container";
import { UserController } from "../../controllers/user.controller";

const router = Router();

// POST /api/v1/users/register
router.post("/register", async (req, res, next) => {
  const controller = container.resolve<UserController>("userController");
  return controller.register(req, res, next);
});

export default router;
