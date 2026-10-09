import { Router } from "express";

import { container } from "../../config/container";
import { ChatController } from "../../controllers/chat.controller";

const router = Router();

router.post("/", async (req, res, next) => {
  const controller = container.resolve<ChatController>("chatController");
  return controller.create(req, res, next);
});

router.post("/join", async (req, res, next) => {
  const controller = container.resolve<ChatController>("chatController");
  return controller.join(req, res, next);
});

export default router;
