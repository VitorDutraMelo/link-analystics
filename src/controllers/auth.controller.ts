import type { RequestHandler } from 'express';
import { authService } from '../services/auth.service.js';
export const register: RequestHandler = async (req, res) =>
  res.status(201).json({ data: await authService.register(req.body) });
export const login: RequestHandler = async (req, res) =>
  res.json({ data: await authService.login(req.body) });
