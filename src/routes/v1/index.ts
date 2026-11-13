import { Router } from "express";

import authRoutes from "./auth.route";
import chatsRoutes from "./chats.route";
import forumRoutes from "./forum.route";
import plannerRoutes from "./planner.route";
import tasksRoutes from "./tasks.route";
import usersRoutes from "./users.route";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", tasksRoutes);
router.use("/chats", chatsRoutes);
router.use("/forum", forumRoutes);
router.use("/planner", plannerRoutes);

export default router;
