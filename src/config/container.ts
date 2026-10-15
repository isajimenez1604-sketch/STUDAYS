import { asClass, createContainer, InjectionMode } from "awilix";

import { AuthController } from "../controllers/auth.controller";
import { ChatController } from "../controllers/chat.controller";
import { ForumController } from "../controllers/forum.controller";
import { TaskController } from "../controllers/task.controller";
import { UserController } from "../controllers/user.controller";

import { TaskRepository } from "../repositories/task.repository";
import { ChatRepository } from "../repositories/chat.repository";
import { ForumRepository } from "../repositories/forum.repository";
import { UserRepository } from "../repositories/user.repository";

import { AuthService } from "../services/auth.service";
import { ChatService } from "../services/chat.service";
import { ForumService } from "../services/forum.service";
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";

// Contenedor de inyección de dependencias.
export const container = createContainer({
injectionMode: InjectionMode.PROXY,
});

container.register({
// Repositories
userRepository: asClass(UserRepository).singleton(),
taskRepository: asClass(TaskRepository).singleton(),
chatRepository: asClass(ChatRepository).singleton(),
forumRepository: asClass(ForumRepository).singleton(),

// Services
userService: asClass(UserService).singleton(),
authService: asClass(AuthService).singleton(),
taskService: asClass(TaskService).singleton(),
chatService: asClass(ChatService).singleton(),
forumService: asClass(ForumService).singleton(),

// Controllers
userController: asClass(UserController).singleton(),
authController: asClass(AuthController).singleton(),
taskController: asClass(TaskController).singleton(),
chatController: asClass(ChatController).singleton(),
forumController: asClass(ForumController).singleton(),
});