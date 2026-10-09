import bcrypt from "bcryptjs";

import { PublicUser } from "../data/models/user.model";
import { RegisterUserDto } from "../dto/user.dto";
import { AppError } from "../exceptions/errors/app.error";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { IUserService } from "./interfaces/user.interface";

const SALT_ROUNDS = 10;

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async register(dto: RegisterUserDto): Promise<PublicUser> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw AppError.emailAlreadyExists();
    }

    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    return this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password_hash,
    });
  }
}
