import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { linkRouter } from './routes/link.routes.js';
import { openapi } from './docs/openapi.js';
import { asyncHandler } from './utils/async-handler.js';
import { redirect } from './controllers/redirect.controller.js';
import { errorHandler, notFound } from './middlewares/error-handler.js';
export const createApp = () => {
  const app = express();
  app.set('trust proxy', env.TRUST_PROXY);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((v) => v.trim()), credentials: false }));
  app.use(express.json({ limit: '20kb' }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }),
  );
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), authRouter);
  app.get('/api/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() }),
  );
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));
  app.get('/api/openapi.json', (_req, res) => res.json(openapi));
  app.use('/api/links', linkRouter);
  app.use('/dashboard', express.static('public'));
  app.get('/:code', asyncHandler(redirect));
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
export const app = createApp();
