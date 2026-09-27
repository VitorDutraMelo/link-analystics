import { z } from 'zod';
export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.email().transform((v) => v.toLowerCase()),
    password: z
      .string()
      .min(8)
      .max(72)
      .regex(/[A-Za-z]/, 'Password must contain a letter')
      .regex(/\d/, 'Password must contain a number'),
  }),
});
export const loginSchema = z.object({
  body: z.object({
    email: z.email().transform((v) => v.toLowerCase()),
    password: z.string().min(1),
  }),
});
