import {
  ForumAuthor,
  ForumComment,
  ForumPost,
} from "../data/models/forum.model";

import {
  CreateForumCommentDto,
  CreateForumPostDto,
} from "../dto/forum.dto";

import { AppError } from "../exceptions/errors/app.error";

import {
  IForumRepository,
} from "../repositories/interfaces/forum.repository.interface";

import {
  IUserRepository,
} from "../repositories/interfaces/user.repository.interface";

import {
  IForumService,
} from "./interfaces/forum.interface";

type ForumServiceDependencies = {
  forumRepository: IForumRepository;
  userRepository: IUserRepository;
};

export class ForumService implements IForumService {

  private readonly forumRepository: IForumRepository;

  private readonly userRepository: IUserRepository;

  constructor({
    forumRepository,
    userRepository,
  }: ForumServiceDependencies) {

    this.forumRepository = forumRepository;
    this.userRepository = userRepository;
  }

  // Crear una publicación
  async createPost(
    dto: CreateForumPostDto
  ): Promise<ForumPost> {
    const [user] = await this.userRepository.findPublicByIds([dto.userId]);
    if (!user) throw AppError.userNotFound();
    const post = await this.forumRepository.createPost(dto);
    return { ...post, author: this.toForumAuthor(user.id, user.name) };
  }

  // Obtener todas las publicaciones
  async getPosts(): Promise<ForumPost[]> {
    const posts = await this.forumRepository.findAllPosts();
    const users = await this.userRepository.findPublicByIds(
      [...new Set(posts.map((post) => post.user_id))]
    );
    const authors = new Map(
      users.map((user) => [user.id, this.toForumAuthor(user.id, user.name)])
    );
    return posts.map((post) => {
      const author = authors.get(post.user_id);
      if (!author) throw AppError.userNotFound();
      return { ...post, author };
    });
  }

  // Crear un comentario
  async createComment(
    dto: CreateForumCommentDto
  ): Promise<ForumComment> {

    const post = await this.forumRepository.findPostById(
      dto.postId
    );

    if (!post) {
      throw AppError.forumPostNotFound();
    }

    const [user] = await this.userRepository.findPublicByIds([dto.userId]);
    if (!user) {
      throw AppError.userNotFound();
    }

    const comment = await this.forumRepository.createComment(dto);
    return {
      ...comment,
      author: this.toForumAuthor(user.id, user.name),
    };
  }

  // Obtener los comentarios de una publicación
  async getComments(
    postId: number
  ): Promise<ForumComment[]> {

    const post = await this.forumRepository.findPostById(
      postId
    );

    if (!post) {
      throw AppError.forumPostNotFound();
    }

    const comments = await this.forumRepository.findCommentsByPostId(postId);
    const users = await this.userRepository.findPublicByIds(
      [...new Set(comments.map((comment) => comment.user_id))]
    );
    const authors = new Map(
      users.map((user) => [user.id, this.toForumAuthor(user.id, user.name)])
    );
    return comments.map((comment) => {
      const author = authors.get(comment.user_id);
      if (!author) throw AppError.userNotFound();
      return { ...comment, author };
    });
  }

  private toForumAuthor(id: number, name: string): ForumAuthor {
    return {
      id,
      name,
      identifier: `STU-${String(id).padStart(6, "0")}`,
    };
  }
}