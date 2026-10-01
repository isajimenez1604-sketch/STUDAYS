import { NextFunction, Request, Response } from "express";

import { parseLoginDto } from "../dto/auth.dto";
import { AuthRequest } from "../middlewares/auth.middleware";
import { IAuthService } from "../services/interfaces/auth.interface";

export class AuthController {
  private readonly authService: IAuthService;

  // Awilix inyecta "authService" desde config/container.ts
  constructor({ authService }: { authService: IAuthService }) {
    this.authService = authService;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseLoginDto(req.body);
      const { token, user } = await this.authService.login(dto);
      res.json({ message: "Inicio de sesión exitoso", token, user });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).userId as string;
      const user = await this.authService.getProfile(userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  };
}
