import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/app-error.js';
export const validate =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success)
      return next(
        new AppError(422, 'VALIDATION_ERROR', 'Request validation failed', result.error.flatten()),
      );
    Object.assign(req, result.data);
    next();
  };
