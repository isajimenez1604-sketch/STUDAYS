import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { env } from "../config/env";

const SESSION_LIFETIME_SECONDS = 60 * 60 * 2;
const SESSION_ISSUER = "studays-api";
const SESSION_AUDIENCE = "studays-mobile";

export function createSessionToken(userId: number): string {
  return jwt.sign(
    { sub: String(userId) },
    env.sessionSecret,
    {
      algorithm: "HS256",
      audience: SESSION_AUDIENCE,
      expiresIn: SESSION_LIFETIME_SECONDS,
      issuer: SESSION_ISSUER,
    }
  );
}

export function getUserIdFromSessionToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, env.sessionSecret, {
      algorithms: ["HS256"],
      audience: SESSION_AUDIENCE,
      issuer: SESSION_ISSUER,
    });

    if (typeof payload === "string" || !payload.sub) return null;
    const userId = Number(payload.sub);
    return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
  } catch (error) {
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError
    ) {
      return null;
    }
    throw error;
  }
}

export const sessionLifetimeSeconds = SESSION_LIFETIME_SECONDS;
