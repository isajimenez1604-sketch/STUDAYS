import { asClass, createContainer, InjectionMode } from "awilix";

import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

// Contenedor de inyección de dependencias.
// Los nombres de abajo son los que se usan en el constructor de cada clase
// y en container.resolve("...").
export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  // Services
  userService: asClass(UserService).singleton(),
  authService: asClass(AuthService).singleton(),

  // Controllers
  userController: asClass(UserController).singleton(),
  authController: asClass(AuthController).singleton(),
});
