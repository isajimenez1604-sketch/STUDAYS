import { rateLimit } from "express-rate-limit";

import { AppError } from "../exceptions/errors/app.error";

const fifteenMinutes = 15 * 60 * 1000;

export const loginRateLimit = rateLimit({
  windowMs: fifteenMinutes,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(AppError.rateLimitExceeded()),
});

export const registerRateLimit = rateLimit({
  windowMs: fifteenMinutes,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(AppError.rateLimitExceeded()),
});

export const passwordResetRequestIpRateLimit = rateLimit({
  windowMs: fifteenMinutes,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(AppError.rateLimitExceeded()),
});

export const passwordResetConfirmIpRateLimit = rateLimit({
  windowMs: fifteenMinutes,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(AppError.rateLimitExceeded()),
});
