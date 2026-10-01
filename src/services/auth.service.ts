import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { supabase } from "../config/supabase";
import { USERS_TABLE, PublicUser, User } from "../data/models/user.model";
import { LoginUserDto } from "../dto/auth.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IAuthService, LoginResult } from "./interfaces/auth.interface";

const PUBLIC_COLUMNS = "id, name, email, created_at";

// Se compara contra este hash cuando el correo no existe, para que la
// respuesta tarde lo mismo y no se pueda adivinar qué correos están registrados.
const DUMMY_HASH = bcrypt.hashSync("studays-dummy-password", 10);

export class AuthService implements IAuthService {
  async login(dto: LoginUserDto): Promise<LoginResult> {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select("id, name, email, password_hash, created_at")
      .eq("email", dto.email)
      .maybeSingle();

    if (error) {
      console.error("[AuthService.login] find:", error);
      throw AppError.database();
    }

    const user = data as User | null;
    const passwordOk = await bcrypt.compare(
      dto.password,
      user?.password_hash ?? DUMMY_HASH
    );

    if (!user || !passwordOk) {
      throw AppError.invalidCredentials();
    }

    const token = jwt.sign({ email: user.email }, env.jwtSecret, {
      subject: user.id,
      expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    });

    const { password_hash: _omit, ...publicUser } = user;
    return { token, user: publicUser };
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select(PUBLIC_COLUMNS)
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("[AuthService.getProfile]", error);
      throw AppError.database();
    }
    if (!data) {
      throw AppError.userNotFound();
    }

    return data as PublicUser;
  }
}
