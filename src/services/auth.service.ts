import bcrypt from "bcryptjs";

import { PublicUser } from "../data/models/user.model";
import { LoginUserDto } from "../dto/auth.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { IAuthService } from "./interfaces/auth.interface";

// Se compara contra este hash cuando el correo no existe, para que la
// respuesta tarde lo mismo y no se pueda adivinar qué correos están registrados.
const DUMMY_HASH = bcrypt.hashSync("studays-dummy-password", 10);

export class AuthService implements IAuthService {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async login(dto: LoginUserDto): Promise<PublicUser> {
    const user = await this.userRepository.findByEmail(dto.email);
    const passwordOk = await bcrypt.compare(
      dto.password,
      user?.password_hash ?? DUMMY_HASH
    );

    if (!user || !passwordOk) {
      throw AppError.invalidCredentials();
    }

    const { password_hash: _omit, ...publicUser } = user;
    return publicUser;
  }
}
