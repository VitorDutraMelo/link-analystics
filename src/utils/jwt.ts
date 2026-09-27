import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
type Payload = { sub: string; email: string };
export const signToken = (user: Payload) =>
  jwt.sign({ email: user.email }, env.JWT_SECRET, {
    subject: user.sub,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
export const verifyToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & { email: string };
