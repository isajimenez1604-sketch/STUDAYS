import bcrypt from "bcryptjs";

import { supabase } from "../config/supabase";
import { USERS_TABLE, PublicUser } from "../data/models/user.model";
import { RegisterUserDto } from "../dto/user.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IUserService } from "./interfaces/user.interface";

const SALT_ROUNDS = 10;
const PUBLIC_COLUMNS = "id, name, email, created_at";

export class UserService implements IUserService {
  async register(dto: RegisterUserDto): Promise<PublicUser> {
    // 1. ¿Ya existe el correo?
    const { data: existing, error: findError } = await supabase
      .from(USERS_TABLE)
      .select("id")
      .eq("email", dto.email)
      .maybeSingle();

    if (findError) {
      console.error("[UserService.register] find:", findError);
      throw AppError.database();
    }
    if (existing) {
      throw AppError.emailAlreadyExists();
    }

    // 2. Hash de la contraseña
    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // 3. Insertar
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .insert({ name: dto.name, email: dto.email, password_hash })
      .select(PUBLIC_COLUMNS)
      .single();

    if (error) {
      // 23505 = unique_violation (dos registros al mismo tiempo)
      if (error.code === "23505") {
        throw AppError.emailAlreadyExists();
      }
      console.error("[UserService.register] insert:", error);
      throw AppError.database();
    }

    return data as PublicUser;
  }
}
