import { PublicUser, User } from "../../data/models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: {
    name: string;
    email: string;
    password_hash: string;
  }): Promise<PublicUser>;
}
