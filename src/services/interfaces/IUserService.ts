import { RegisterUserDto } from "../../dto/RegisterUserDto";
import { PublicUser } from "../../data/models/User";

export interface IUserService {
  register(dto: RegisterUserDto): Promise<PublicUser>;
}
