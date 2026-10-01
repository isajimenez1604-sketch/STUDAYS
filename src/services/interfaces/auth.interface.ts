import { PublicUser } from "../../data/models/user.model";
import { LoginUserDto } from "../../dto/auth.dto";

export interface LoginResult {
  token: string;
  user: PublicUser;
}

export interface IAuthService {
  login(dto: LoginUserDto): Promise<LoginResult>;
  getProfile(userId: string): Promise<PublicUser>;
}
