import {
  ForumCommentRecord,
  ForumPostRecord,
} from "../../data/models/forum.model";

import {
  CreateForumCommentDto,
  CreateForumPostDto,
} from "../../dto/forum.dto";

export interface IForumRepository {
  // Crear una publicación
  createPost(
    input: CreateForumPostDto
  ): Promise<ForumPostRecord>;

  // Buscar una publicación por su ID
  findPostById(
    id: number
  ): Promise<ForumPostRecord | null>;

  // Obtener todas las publicaciones
  findAllPosts(): Promise<ForumPostRecord[]>;

  // Crear un comentario
  createComment(
    input: CreateForumCommentDto
  ): Promise<ForumCommentRecord>;

  // Obtener los comentarios de una publicación
  findCommentsByPostId(
    postId: number
  ): Promise<ForumCommentRecord[]>;
}