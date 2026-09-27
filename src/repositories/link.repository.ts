import { prisma } from '../config/prisma.js';
export const linkRepository = {
  create: (data: { shortCode: string; originalUrl: string; userId: string }) =>
    prisma.link.create({ data }),
  findCode: (shortCode: string) => prisma.link.findUnique({ where: { shortCode } }),
  findOwned: (id: string, userId: string) =>
    prisma.link.findFirst({
      where: { id, userId },
      include: { _count: { select: { clicks: true } } },
    }),
  listOwned: async (userId: string, page: number, limit: number) => {
    const where = { userId };
    const [items, total] = await prisma.$transaction([
      prisma.link.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { clicks: true } } },
      }),
      prisma.link.count({ where }),
    ]);
    return { items, total };
  },
  deleteOwned: (id: string, userId: string) => prisma.link.deleteMany({ where: { id, userId } }),
  codeExists: async (shortCode: string) =>
    Boolean(await prisma.link.findUnique({ where: { shortCode }, select: { id: true } })),
};
