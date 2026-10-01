import { Router } from "express";

import { AuthController } from "../../controllers/AuthController";
import { authenticate } from "../../middlewares/authenticate";
import { AuthService } from "../../services/AuthService";

const router = Router();
const controller = new AuthController(new AuthService());

// POST /api/v1/auth/login
router.post("/login", controller.login);

// GET /api/v1/auth/me  (requiere token)
router.get("/me", authenticate, controller.me);

export default router;
