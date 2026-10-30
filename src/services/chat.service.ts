import { Chat, ChatMember } from "../data/models/chat.model";
import { CreateChatDto, JoinChatDto } from "../dto/chat.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IChatRepository } from "../repositories/interfaces/chat.repository.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { IChatService } from "./interfaces/chat.interface";

export class ChatService implements IChatService {
  private readonly chatRepository: IChatRepository;
  private readonly userRepository: IUserRepository;

  constructor({
    chatRepository,
    userRepository,
  }: {
    chatRepository: IChatRepository;
    userRepository: IUserRepository;
  }) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  }

  async create(dto: CreateChatDto): Promise<Chat> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw AppError.userNotFound();
    }

    return this.chatRepository.create(dto.name, dto.userId);
  }

  async join(dto: JoinChatDto): Promise<ChatMember> {
    const chat = await this.chatRepository.findById(dto.chatId);
    if (!chat) {
      throw AppError.chatNotFound();
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw AppError.userNotFound();
    }

    if (chat.creator_id === dto.userId) {
      throw AppError.alreadyChatMember();
    }

    const existingMember = await this.chatRepository.findMember(
      dto.chatId,
      dto.userId
    );
    if (existingMember) {
      throw AppError.alreadyChatMember();
    }

    return this.chatRepository.addMember(dto.chatId, dto.userId);
  }
}
