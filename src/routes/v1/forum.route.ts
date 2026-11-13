import { Router } from "express";

import { container } from "../../config/container";

import {
  ForumController,
} from "../../controllers/forum.controller";
import { requireAuthentication } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuthentication);

// GET /api/v1/forum/posts
// Consultar todas las publicaciones
router.get("/posts", async (req, res, next) => {
  const controller = container.resolve<ForumController>(
    "forumController"
  );

  return controller.getPosts(req, res, next);
});

// POST /api/v1/forum/posts
// Crear una publicación
router.post("/posts", async (req, res, next) => {
  const controller = container.resolve<ForumController>(
    "forumController"
  );

  return controller.createPost(req, res, next);
});

// GET /api/v1/forum/posts/:postId/comments
// Consultar los comentarios de una publicación
router.get(
  "/posts/:postId/comments",
  async (req, res, next) => {
    const controller = container.resolve<ForumController>(
      "forumController"
    );

    return controller.getComments(req, res, next);
  }
);

// POST /api/v1/forum/posts/:postId/comments
// Crear un comentario
router.post(
  "/posts/:postId/comments",
  async (req, res, next) => {
    const controller = container.resolve<ForumController>(
      "forumController"
    );

    return controller.createComment(req, res, next);
  }
);

export default router;