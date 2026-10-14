import { supabase } from "../config/supabase";

import {
  FORUM_COMMENTS_TABLE,
  FORUM_POSTS_TABLE,
  ForumComment,
  ForumPost,
} from "../data/models/forum.model";

import {
  CreateForumCommentDto,
  CreateForumPostDto,
} from "../dto/forum.dto";

import { AppError } from "../exceptions/errors/app.error";

import { IForumRepository } from "./interfaces/forum.repository.interface";

const POST_COLUMNS =
  "id, user_id, title, content, created_at";

const COMMENT_COLUMNS =
  "id, post_id, user_id, content, created_at";

export class ForumRepository implements IForumRepository {

  // Crear una publicación
  async createPost(
    input: CreateForumPostDto
  ): Promise<ForumPost> {

    const { data, error } = await supabase
      .from(FORUM_POSTS_TABLE)
      .insert({
        user_id: input.userId,
        title: input.title,
        content: input.content,
      })
      .select(POST_COLUMNS)
      .single();

    if (error) {
      if (error.code === "23503") {
        throw AppError.userNotFound();
      }

      console.error(
        "[ForumRepository.createPost]",
        error
      );

      throw AppError.database();
    }

    return data as ForumPost;
  }

  // Buscar una publicación por su ID
  async findPostById(
    id: number
  ): Promise<ForumPost | null> {

    const { data, error } = await supabase
      .from(FORUM_POSTS_TABLE)
      .select(POST_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        "[ForumRepository.findPostById]",
        error
      );

      throw AppError.database();
    }

    return data as ForumPost | null;
  }

  // Obtener todas las publicaciones
  // Las más recientes aparecen primero
  async findAllPosts(): Promise<ForumPost[]> {

    const { data, error } = await supabase
      .from(FORUM_POSTS_TABLE)
      .select(POST_COLUMNS)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "[ForumRepository.findAllPosts]",
        error
      );

      throw AppError.database();
    }

    return (data ?? []) as ForumPost[];
  }

  // Crear un comentario
  async createComment(
    input: CreateForumCommentDto
  ): Promise<ForumComment> {

    const { data, error } = await supabase
      .from(FORUM_COMMENTS_TABLE)
      .insert({
        post_id: input.postId,
        user_id: input.userId,
        content: input.content,
      })
      .select(COMMENT_COLUMNS)
      .single();

    if (error) {
      if (error.code === "23503") {
        throw AppError.forumPostOrUserNotFound();
      }

      console.error(
        "[ForumRepository.createComment]",
        error
      );

      throw AppError.database();
    }

    return data as ForumComment;
  }

  // Obtener los comentarios de una publicación
  async findCommentsByPostId(
    postId: number
  ): Promise<ForumComment[]> {

    const { data, error } = await supabase
      .from(FORUM_COMMENTS_TABLE)
      .select(COMMENT_COLUMNS)
      .eq("post_id", postId)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "[ForumRepository.findCommentsByPostId]",
        error
      );

      throw AppError.database();
    }

    return (data ?? []) as ForumComment[];
  }
}