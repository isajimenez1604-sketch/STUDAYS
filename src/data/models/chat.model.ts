export const CHATS_TABLE = "chats";
export const CHAT_MEMBERS_TABLE = "chat_members";

export interface Chat {
  id: number;
  name: string;
  creator_id: number;
  created_at: string;
}

export interface ChatMember {
  chat_id: number;
  user_id: number;
  joined_at: string;
}
