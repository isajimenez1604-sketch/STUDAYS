import { supabase } from "../config/supabase";
import {
  USERS_TABLE,
  PublicUser,
  User,
  UserSummary,
} from "../data/models/user.model";
import { AppError } from "../exceptions/errors/app.error";
import { IUserRepository } from "./interfaces/user.repository.interface";

const USER_COLUMNS = "id, name, email, password_hash, created_at";
const PUBLIC_USER_COLUMNS = "id, name, email, created_at";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select(USER_COLUMNS)
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("[UserRepository.findByEmail]", error);
      throw AppError.database();
    }

    return data as User | null;
  }

  async findById(id: number): Promise<UserSummary | null> {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[UserRepository.findById]", error);
      throw AppError.database();
    }

    return data as UserSummary | null;
  }

  async create(input: {
    name: string;
    email: string;
    password_hash: string;
  }): Promise<PublicUser> {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .insert(input)
      .select(PUBLIC_USER_COLUMNS)
      .single();

    if (error) {
      if (error.code === "23505") {
        throw AppError.emailAlreadyExists();
      }
      console.error("[UserRepository.create]", error);
      throw AppError.database();
    }

    return data as PublicUser;
  }
}
