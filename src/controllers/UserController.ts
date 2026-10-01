import { NextFunction, Request, Response } from "express";

import { parseRegisterDto } from "../dto/RegisterUserDto";
import { IUserService } from "../services/interfaces/IUserService";

export class UserController {
  constructor(private readonly userService: IUserService) {}

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
