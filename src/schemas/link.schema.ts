import { z } from 'zod';
export const createLinkSchema = z.object({
  body: z.object({
    url: z.url().refine((v) => {
      try {
        return ['http:', 'https:'].includes(new URL(v).protocol);
      } catch {
        return false;
      }
    }, 'Only HTTP(S) URLs are supported'),
  }),
});
export const idSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
export const listSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});
