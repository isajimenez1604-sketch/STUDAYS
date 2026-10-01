import bcrypt from "bcryptjs";

import { supabase } from "../config/supabase";
import { USERS_TABLE, PublicUser } from "../data/models/User";
import { RegisterUserDto } from "../dto/RegisterUserDto";
import { ConflictError, DatabaseError } from "../exceptions/errors";
import { IUserService } from "./interfaces/IUserService";

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
      throw new DatabaseError();
    }
    if (existing) {
      throw new ConflictError("El correo ya está registrado");
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
      // 23505 = unique_violation (por si dos registros llegan al mismo tiempo)
      if (error.code === "23505") {
        throw new ConflictError("El correo ya está registrado");
      }
      console.error("[UserService.register] insert:", error);
      throw new DatabaseError();
    }

    return data as PublicUser;
  }
}
