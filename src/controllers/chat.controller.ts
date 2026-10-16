import { NextFunction, Request, Response } from "express";

import { parseCreateChatDto, parseJoinChatDto } from "../dto/chat.dto";
import { IChatService } from "../services/interfaces/chat.interface";

export class ChatController {
  private readonly chatService: IChatService;

  constructor({ chatService }: { chatService: IChatService }) {
    this.chatService = chatService;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseCreateChatDto(req.body);
      const chat = await this.chatService.create(dto);
      res.status(201).json({ message: "Chat creado", chat });
    } catch (error) {
      next(error);
    }
  };

  join = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseJoinChatDto(req.body);
      const member = await this.chatService.join(dto);
      res.status(201).json({ message: "Te uniste al chat", member });
    } catch (error) {
      next(error);
    }
  };
}
