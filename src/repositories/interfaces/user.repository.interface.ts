import {
  PublicUser,
  PublicUserSummary,
  User,
  UserSummary,
} from "../../data/models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<UserSummary | null>;
  findPublicByIds(ids: number[]): Promise<PublicUserSummary[]>;
  create(user: {
    name: string;
    email: string;
    password_hash: string;
  }): Promise<PublicUser>;
}
