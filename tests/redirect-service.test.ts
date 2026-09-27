import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../src/repositories/link.repository.js', () => ({
  linkRepository: { findCode: vi.fn() },
}));
vi.mock('../src/repositories/click.repository.js', () => ({
  clickRepository: { create: vi.fn() },
}));
import { linkRepository } from '../src/repositories/link.repository.js';
import { clickRepository } from '../src/repositories/click.repository.js';
import { redirectService } from '../src/services/redirect.service.js';
describe('redirect service', () => {
  beforeEach(() => vi.clearAllMocks());
  it('records analytics before returning destination', async () => {
    vi.mocked(linkRepository.findCode).mockResolvedValue({
      id: 'l1',
      originalUrl: 'https://example.com',
    } as any);
    const url = await redirectService.resolve('abc1234', {
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
    });
    expect(clickRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ linkId: 'l1', browser: 'Chrome' }),
    );
    expect(url).toBe('https://example.com');
  });
  it('rejects unknown codes', async () => {
    vi.mocked(linkRepository.findCode).mockResolvedValue(null);
    await expect(redirectService.resolve('missing', {})).rejects.toMatchObject({ statusCode: 404 });
  });
});
