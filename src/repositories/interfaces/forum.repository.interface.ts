import {
  ForumComment,
  ForumPost,
} from "../../data/models/forum.model";

import {
  CreateForumCommentDto,
  CreateForumPostDto,
} from "../../dto/forum.dto";

export interface IForumRepository {
  // Crear una publicación
  createPost(
    input: CreateForumPostDto
  ): Promise<ForumPost>;

  // Buscar una publicación por su ID
  findPostById(
    id: number
  ): Promise<ForumPost | null>;

  // Obtener todas las publicaciones
  findAllPosts(): Promise<ForumPost[]>;

  // Crear un comentario
  createComment(
    input: CreateForumCommentDto
  ): Promise<ForumComment>;

  // Obtener los comentarios de una publicación
  findCommentsByPostId(
    postId: number
  ): Promise<ForumComment[]>;
}