import { Router } from "express";

import authRoutes from "./auth.route";
import chatsRoutes from "./chats.route";
import tasksRoutes from "./tasks.route";
import usersRoutes from "./users.route";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/chats", chatsRoutes);
router.use("/tasks", tasksRoutes);

export default router;
