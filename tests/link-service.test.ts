import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../src/repositories/link.repository.js', () => ({
  linkRepository: {
    codeExists: vi.fn(),
    create: vi.fn(),
    findOwned: vi.fn(),
    deleteOwned: vi.fn(),
    listOwned: vi.fn(),
  },
}));
import { linkRepository } from '../src/repositories/link.repository.js';
import { linkService } from '../src/services/link.service.js';
describe('link service ownership', () => {
  beforeEach(() => vi.clearAllMocks());
  it('creates a non-predictable short link', async () => {
    vi.mocked(linkRepository.codeExists).mockResolvedValue(false);
    vi.mocked(linkRepository.create).mockResolvedValue({
      id: 'l1',
      shortCode: 'abc1234',
      originalUrl: 'https://example.com',
      userId: 'u1',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    const link = await linkService.create('u1', 'https://example.com');
    expect(link.shortCode).toHaveLength(7);
    expect(link.shortUrl).toContain(link.shortCode);
  });
  it('does not expose another user link', async () => {
    vi.mocked(linkRepository.findOwned).mockResolvedValue(null);
    await expect(linkService.get('wrong-user', 'l1')).rejects.toMatchObject({
      statusCode: 404,
      code: 'LINK_NOT_FOUND',
    });
  });
  it('does not delete another user link', async () => {
    vi.mocked(linkRepository.deleteOwned).mockResolvedValue({ count: 0 });
    await expect(linkService.remove('wrong-user', 'l1')).rejects.toMatchObject({ statusCode: 404 });
  });
});
