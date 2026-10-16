import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  parseCreateForumCommentDto,
  parseCreateForumPostDto,
} from "../dto/forum.dto";

import {
  IForumService,
} from "../services/interfaces/forum.interface";

export class ForumController {
  private readonly forumService: IForumService;

  constructor({
    forumService,
  }: {
    forumService: IForumService;
  }) {
    this.forumService = forumService;
  }

  // Crear una publicación
  async createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = parseCreateForumPostDto(req.body);

      const post = await this.forumService.createPost(dto);

      res.status(201).json({
        message: "Publicación creada correctamente",
        post,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener todas las publicaciones
  async getPosts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const posts = await this.forumService.getPosts();

      res.status(200).json({
        message: "Publicaciones obtenidas correctamente",
        posts,
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear un comentario
  async createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = Number(req.params.postId);

      const dto = parseCreateForumCommentDto(
        req.body,
        postId
      );

      const comment = await this.forumService.createComment(
        dto
      );

      res.status(201).json({
        message: "Comentario agregado correctamente",
        comment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener los comentarios de una publicación
  async getComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = Number(req.params.postId);

      const comments = await this.forumService.getComments(
        postId
      );

      res.status(200).json({
        message: "Comentarios obtenidos correctamente",
        comments,
      });
    } catch (error) {
      next(error);
    }
  }
}