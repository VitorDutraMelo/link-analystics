import { prisma } from '../config/prisma.js';
export type ClickInput = {
  linkId: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  device?: string;
  browser?: string;
  operatingSystem?: string;
};
export const clickRepository = {
  create: (data: ClickInput) => prisma.click.create({ data }),
  findForAnalytics: (linkId: string, since: Date) =>
    prisma.click.findMany({
      where: { linkId, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    }),
  countAll: (linkId: string) => prisma.click.count({ where: { linkId } }),
};
