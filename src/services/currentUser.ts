
import type { AppUser } from "./authApi";

let currentUser: AppUser | null = null;
let accessToken: string | null = null;

export function setCurrentUser(user: AppUser, token: string): void {
  currentUser = user;
  accessToken = token;
}

export function getCurrentUser(): AppUser | null {
  return currentUser;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearCurrentUser(): void {
  currentUser = null;
  accessToken = null;
}
