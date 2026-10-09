export const USERS_TABLE = "users";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface UserSummary {
  id: number;
}

// Lo que se devuelve al cliente (nunca el hash)
export type PublicUser = Omit<User, "password_hash">;
