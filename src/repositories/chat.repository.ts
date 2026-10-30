import { supabase } from "../config/supabase";
import {
  CHAT_MEMBERS_TABLE,
  CHATS_TABLE,
  Chat,
  ChatMember,
} from "../data/models/chat.model";
import { AppError } from "../exceptions/errors/app.error";
import { IChatRepository } from "./interfaces/chat.repository.interface";

const CHAT_COLUMNS = "id, name, creator_id, created_at";
const MEMBER_COLUMNS = "chat_id, user_id, joined_at";

export class ChatRepository implements IChatRepository {
  async create(name: string, creatorId: number): Promise<Chat> {
    const { data, error } = await supabase
      .from(CHATS_TABLE)
      .insert({ name, creator_id: creatorId })
      .select(CHAT_COLUMNS)
      .single();

    if (error) {
      console.error("[ChatRepository.create]", error);
      throw AppError.database();
    }

    return data as Chat;
  }

  async findById(id: number): Promise<Chat | null> {
    const { data, error } = await supabase
      .from(CHATS_TABLE)
      .select(CHAT_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[ChatRepository.findById]", error);
      throw AppError.database();
    }

    return data as Chat | null;
  }

  async findMember(
    chatId: number,
    userId: number
  ): Promise<ChatMember | null> {
    const { data, error } = await supabase
      .from(CHAT_MEMBERS_TABLE)
      .select(MEMBER_COLUMNS)
      .eq("chat_id", chatId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[ChatRepository.findMember]", error);
      throw AppError.database();
    }

    return data as ChatMember | null;
  }

  async addMember(chatId: number, userId: number): Promise<ChatMember> {
    const { data, error } = await supabase
      .from(CHAT_MEMBERS_TABLE)
      .insert({ chat_id: chatId, user_id: userId })
      .select(MEMBER_COLUMNS)
      .single();

    if (error) {
      if (error.code === "23505") {
        throw AppError.alreadyChatMember();
      }
      if (error.code === "23503") {
        throw AppError.chatOrUserNotFound();
      }
      console.error("[ChatRepository.addMember]", error);
      throw AppError.database();
    }

    return data as ChatMember;
  }
}
