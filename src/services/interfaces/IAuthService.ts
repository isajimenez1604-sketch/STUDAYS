import { LoginUserDto } from "../../dto/LoginUserDto";
import { PublicUser } from "../../data/models/User";

export interface LoginResult {
  token: string;
  user: PublicUser;
}

export interface IAuthService {
  login(dto: LoginUserDto): Promise<LoginResult>;
  getProfile(userId: string): Promise<PublicUser>;
}
