import { PublicUser, User, UserSummary } from "../../data/models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<UserSummary | null>;
  create(user: {
    name: string;
    email: string;
    password_hash: string;
  }): Promise<PublicUser>;
}
