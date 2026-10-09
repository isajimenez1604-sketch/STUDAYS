import { PublicUser } from "../../data/models/user.model";
import { LoginUserDto } from "../../dto/auth.dto";

export interface IAuthService {
  login(dto: LoginUserDto): Promise<PublicUser>;
}
