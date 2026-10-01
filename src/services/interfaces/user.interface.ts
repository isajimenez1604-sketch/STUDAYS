import { PublicUser } from "../../data/models/user.model";
import { RegisterUserDto } from "../../dto/user.dto";

export interface IUserService {
  register(dto: RegisterUserDto): Promise<PublicUser>;
}
