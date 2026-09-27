import { describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authenticate } from '../src/middlewares/auth.js';
import { errorHandler } from '../src/middlewares/error-handler.js';
import { signToken } from '../src/utils/jwt.js';
const app = express();
app.get('/private', authenticate, (req, res) => res.json(req.user));
app.use(errorHandler);
describe('authentication middleware', () => {
  it('rejects missing tokens', async () => {
    const r = await request(app).get('/private');
    expect(r.status).toBe(401);
    expect(r.body.error.code).toBe('AUTH_REQUIRED');
  });
  it('accepts a valid token', async () => {
    const token = signToken({ sub: 'user-1', email: 'vitor@example.com' });
    const r = await request(app).get('/private').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.id).toBe('user-1');
  });
  it('rejects malformed tokens', async () => {
    const r = await request(app).get('/private').set('Authorization', 'Bearer broken');
    expect(r.status).toBe(401);
  });
});
