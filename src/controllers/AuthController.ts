import { NextFunction, Request, Response } from "express";

import { parseLoginDto } from "../dto/LoginUserDto";
import { AuthRequest } from "../middlewares/authenticate";
import { IAuthService } from "../services/interfaces/IAuthService";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

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
