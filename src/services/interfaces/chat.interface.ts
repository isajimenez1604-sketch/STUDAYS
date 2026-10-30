import { Chat, ChatMember } from "../../data/models/chat.model";
import { CreateChatDto, JoinChatDto } from "../../dto/chat.dto";

export interface IChatService {
  create(dto: CreateChatDto): Promise<Chat>;
  join(dto: JoinChatDto): Promise<ChatMember>;
}
