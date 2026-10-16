import {
  ForumComment,
  ForumPost,
} from "../../data/models/forum.model";

import {
  CreateForumCommentDto,
  CreateForumPostDto,
} from "../../dto/forum.dto";

export interface IForumService {

  // Crear una publicación
  createPost(
    dto: CreateForumPostDto
  ): Promise<ForumPost>;

  // Obtener todas las publicaciones
  getPosts(): Promise<ForumPost[]>;

  // Crear un comentario
  createComment(
    dto: CreateForumCommentDto
  ): Promise<ForumComment>;

  // Obtener los comentarios de una publicación
  getComments(
    postId: number
  ): Promise<ForumComment[]>;
}