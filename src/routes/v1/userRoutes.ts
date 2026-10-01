import { Router } from "express";

import { UserController } from "../../controllers/UserController";
import { UserService } from "../../services/UserService";

const router = Router();
const controller = new UserController(new UserService());

// POST /api/v1/users/register
router.post("/register", controller.register);

export default router;
