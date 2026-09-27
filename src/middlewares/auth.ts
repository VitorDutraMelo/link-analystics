import type { RequestHandler } from 'express';
import { AppError } from '../utils/app-error.js';
import { verifyToken } from '../utils/jwt.js';
export const authenticate: RequestHandler = (req, _res, next) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token)
    return next(new AppError(401, 'AUTH_REQUIRED', 'Bearer token is required'));
  try {
    const payload = verifyToken(token);
    if (!payload.sub) throw new Error();
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return next(new AppError(401, 'INVALID_TOKEN', 'Token is invalid or expired'));
  }
};
