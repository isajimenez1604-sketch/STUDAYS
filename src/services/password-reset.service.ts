import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";

import { AppError } from "../exceptions/errors/app.error";
import { PasswordResetRepository } from "../repositories/password-reset.repository";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { EmailService } from "./email.service";

const CODE_SALT_ROUNDS = 10;
const PASSWORD_SALT_ROUNDS = 10;

export class PasswordResetService {
  private readonly userRepository: IUserRepository;
  private readonly passwordResetRepository: PasswordResetRepository;
  private readonly emailService: EmailService;

  constructor({
    userRepository,
    passwordResetRepository,
    emailService,
  }: {
    userRepository: IUserRepository;
    passwordResetRepository: PasswordResetRepository;
    emailService: EmailService;
  }) {
    this.userRepository = userRepository;
    this.passwordResetRepository = passwordResetRepository;
    this.emailService = emailService;
  }

  async requestCode(email: string): Promise<void> {
    this.emailService.assertConfigured();
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    const code = String(randomInt(100000, 1000000));
    const codeHash = await bcrypt.hash(code, CODE_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await this.passwordResetRepository.replaceForUser(
      user.id,
      codeHash,
      expiresAt
    );

    try {
      await this.emailService.sendPasswordResetCode(user.email, code);
    } catch (error) {
      await this.passwordResetRepository.deleteForUser(user.id);
      throw error;
    }
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw AppError.invalidPasswordResetCode();

    const resetCode = await this.passwordResetRepository.findLatestActive(
      user.id
    );
    if (
      !resetCode ||
      !(await bcrypt.compare(code, resetCode.code_hash))
    ) {
      throw AppError.invalidPasswordResetCode();
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      PASSWORD_SALT_ROUNDS
    );
    const consumed = await this.passwordResetRepository.consumeAndUpdatePassword(
      user.id,
      resetCode.code_hash,
      passwordHash
    );

    if (!consumed) throw AppError.invalidPasswordResetCode();
  }
}
