import { prisma } from '../config/prisma.js';
export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  create: (data: { name: string; email: string; passwordHash: string }) =>
    prisma.user.create({ data, select: { id: true, name: true, email: true, createdAt: true } }),
};
