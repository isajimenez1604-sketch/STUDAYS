import { asClass, createContainer, InjectionMode } from "awilix";

import { AuthController } from "../controllers/auth.controller";
import { TaskController } from "../controllers/task.controller";
import { UserController } from "../controllers/user.controller";
import { TaskRepository } from "../repositories/task.repository";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";

// Contenedor de inyección de dependencias.
// Los nombres de abajo son los que se usan en el constructor de cada clase
// y en container.resolve("...").
export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  // Repositories: acceso a la base de datos
  userRepository: asClass(UserRepository).singleton(),
  taskRepository: asClass(TaskRepository).singleton(),

  // Services
  userService: asClass(UserService).singleton(),
  authService: asClass(AuthService).singleton(),
  taskService: asClass(TaskService).singleton(),

  // Controllers
  userController: asClass(UserController).singleton(),
  authController: asClass(AuthController).singleton(),
  taskController: asClass(TaskController).singleton(),
});
