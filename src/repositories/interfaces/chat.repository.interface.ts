import { Chat, ChatMember } from "../../data/models/chat.model";

export interface IChatRepository {
  create(name: string, creatorId: number): Promise<Chat>;
  findById(id: number): Promise<Chat | null>;
  findMember(chatId: number, userId: number): Promise<ChatMember | null>;
  addMember(chatId: number, userId: number): Promise<ChatMember>;
}
