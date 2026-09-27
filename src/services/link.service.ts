import { customAlphabet } from 'nanoid';
import { env } from '../config/env.js';
import { linkRepository } from '../repositories/link.repository.js';
import { AppError } from '../utils/app-error.js';
const codeGenerator = customAlphabet(
  '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  7,
);
const present = (link: any) => ({
  id: link.id,
  originalUrl: link.originalUrl,
  shortCode: link.shortCode,
  shortUrl: `${env.APP_URL}/${link.shortCode}`,
  createdAt: link.createdAt,
  updatedAt: link.updatedAt,
  totalClicks: link._count?.clicks,
});
export const linkService = {
  async create(userId: string, originalUrl: string) {
    let shortCode = '';
    for (let i = 0; i < 5; i++) {
      shortCode = codeGenerator();
      if (!(await linkRepository.codeExists(shortCode))) break;
      if (i === 4)
        throw new AppError(500, 'CODE_GENERATION_FAILED', 'Could not generate a unique short code');
    }
    return present(await linkRepository.create({ shortCode, originalUrl, userId }));
  },
  async list(userId: string, page: number, limit: number) {
    const { items, total } = await linkRepository.listOwned(userId, page, limit);
    return {
      data: items.map(present),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async get(userId: string, id: string) {
    const link = await linkRepository.findOwned(id, userId);
    if (!link) throw new AppError(404, 'LINK_NOT_FOUND', 'Link not found');
    return present(link);
  },
  async remove(userId: string, id: string) {
    const result = await linkRepository.deleteOwned(id, userId);
    if (!result.count) throw new AppError(404, 'LINK_NOT_FOUND', 'Link not found');
  },
};
