import { Router } from "express";

import authRoutes from "./auth.route";
import usersRoutes from "./users.route";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
router.use("/users", usersRoutes);
router.use("/auth", authRoutes);

export default router;
