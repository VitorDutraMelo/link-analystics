import type { RequestHandler } from 'express';
import { linkService } from '../services/link.service.js';
import { analyticsService } from '../services/analytics.service.js';
export const createLink: RequestHandler = async (req, res) =>
  res.status(201).json({ data: await linkService.create(req.user!.id, req.body.url) });
export const listLinks: RequestHandler = async (req, res) =>
  res.json(await linkService.list(req.user!.id, Number(req.query.page), Number(req.query.limit)));
export const getLink: RequestHandler = async (req, res) =>
  res.json({ data: await linkService.get(req.user!.id, String(req.params.id)) });
export const deleteLink: RequestHandler = async (req, res) => {
  await linkService.remove(req.user!.id, String(req.params.id));
  res.status(204).send();
};
export const getAnalytics: RequestHandler = async (req, res) =>
  res.json({ data: await analyticsService.get(req.user!.id, String(req.params.id)) });
