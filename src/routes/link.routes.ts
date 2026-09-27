import { Router } from 'express';
import {
  createLink,
  deleteLink,
  getAnalytics,
  getLink,
  listLinks,
} from '../controllers/link.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createLinkSchema, idSchema, listSchema } from '../schemas/link.schema.js';
import { asyncHandler } from '../utils/async-handler.js';
export const linkRouter = Router();
linkRouter.use(authenticate);
linkRouter
  .route('/')
  .get(validate(listSchema), asyncHandler(listLinks))
  .post(validate(createLinkSchema), asyncHandler(createLink));
linkRouter.get('/:id/analytics', validate(idSchema), asyncHandler(getAnalytics));
linkRouter
  .route('/:id')
  .get(validate(idSchema), asyncHandler(getLink))
  .delete(validate(idSchema), asyncHandler(deleteLink));
