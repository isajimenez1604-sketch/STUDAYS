import { NextFunction, Request, Response } from "express";

import {
  parseLoginDto,
  parseRequestPasswordResetDto,
  parseResetPasswordDto,
} from "../dto/auth.dto";
import { IAuthService } from "../services/interfaces/auth.interface";
import { PasswordResetService } from "../services/password-reset.service";
import {
  createSessionToken,
  sessionLifetimeSeconds,
} from "../services/session-token.service";

export class AuthController {
  private readonly authService: IAuthService;
  private readonly passwordResetService: PasswordResetService;

  constructor({
    authService,
    passwordResetService,
  }: {
    authService: IAuthService;
    passwordResetService: PasswordResetService;
  }) {
    this.authService = authService;
    this.passwordResetService = passwordResetService;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseLoginDto(req.body);
      const user = await this.authService.login(dto);
      res.json({
        message: "Inicio de sesión exitoso",
        accessToken: createSessionToken(user.id),
        expiresIn: sessionLifetimeSeconds,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = parseRequestPasswordResetDto(req.body);
      await this.passwordResetService.requestCode(email);
      res.json({
        message:
          "Si el correo está registrado, recibirás un código de recuperación.",
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = parseResetPasswordDto(req.body);
      await this.passwordResetService.resetPassword(
        dto.email,
        dto.code,
        dto.newPassword
      );
      res.json({ message: "La contraseña se actualizó correctamente." });
    } catch (error) {
      next(error);
    }
  };
}
