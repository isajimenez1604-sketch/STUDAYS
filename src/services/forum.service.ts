import {
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

    const user = await this.userRepository.findById(
      dto.userId
    );

    if (!user) {
      throw AppError.userNotFound();
    }

    return this.forumRepository.createPost(dto);
  }

  // Obtener todas las publicaciones
  async getPosts(): Promise<ForumPost[]> {

    return this.forumRepository.findAllPosts();
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

    const user = await this.userRepository.findById(
      dto.userId
    );

    if (!user) {
      throw AppError.userNotFound();
    }

    return this.forumRepository.createComment(dto);
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

    return this.forumRepository.findCommentsByPostId(
      postId
    );
  }
}