
import { AppUser } from "./authApi";

let currentUser: AppUser | null = null;

export function setCurrentUser(user: AppUser): void {
  currentUser = user;
}

export function getCurrentUser(): AppUser | null {
  return currentUser;
}
