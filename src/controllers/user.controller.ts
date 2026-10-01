import { NextFunction, Request, Response } from "express";

import { parseRegisterDto } from "../dto/user.dto";
import { IUserService } from "../services/interfaces/user.interface";

export class UserController {
  private readonly userService: IUserService;

  // Awilix inyecta "userService" desde config/container.ts
  constructor({ userService }: { userService: IUserService }) {
    this.userService = userService;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseRegisterDto(req.body);
      const user = await this.userService.register(dto);
      res.status(201).json({ message: "Usuario registrado", user });
    } catch (error) {
      next(error);
    }
  };
}
