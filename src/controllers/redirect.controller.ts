import type { RequestHandler } from 'express';
import { redirectService } from '../services/redirect.service.js';
export const redirect: RequestHandler = async (req, res) => {
  const url = await redirectService.resolve(String(req.params.code), {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    referrer: req.get('referer'),
  });
  res.redirect(302, url);
};
