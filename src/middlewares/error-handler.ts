import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/app-error.js';
import { env } from '../config/env.js';
export const notFound: RequestHandler = (_req, _res, next) =>
  next(new AppError(404, 'ROUTE_NOT_FOUND', 'Route not found'));
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  void _next;
  let err = error;
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
    err = new AppError(409, 'CONFLICT', 'Resource already exists');
  if (!(err instanceof AppError)) {
    if (env.NODE_ENV !== 'production') console.error(err);
    err = new AppError(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  }
  const appErr = err as AppError;
  res.status(appErr.statusCode).json({
    error: {
      code: appErr.code,
      message: appErr.message,
      ...(appErr.details ? { details: appErr.details } : {}),
      ...(env.NODE_ENV === 'development' && error?.stack ? { stack: error.stack } : {}),
    },
  });
};
