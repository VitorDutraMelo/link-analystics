import { UAParser } from 'ua-parser-js';
import { clickRepository } from '../repositories/click.repository.js';
import { linkRepository } from '../repositories/link.repository.js';
import { AppError } from '../utils/app-error.js';
export const redirectService = {
  async resolve(code: string, meta: { ip?: string; userAgent?: string; referrer?: string }) {
    const link = await linkRepository.findCode(code);
    if (!link) throw new AppError(404, 'LINK_NOT_FOUND', 'Short link not found');
    const parsed = UAParser(meta.userAgent || '');
    await clickRepository.create({
      linkId: link.id,
      ipAddress: meta.ip?.slice(0, 64),
      userAgent: meta.userAgent?.slice(0, 2000),
      referrer: meta.referrer?.slice(0, 2000),
      device: (parsed.device.type || 'desktop').slice(0, 64),
      browser: parsed.browser.name?.slice(0, 64),
      operatingSystem: parsed.os.name?.slice(0, 64),
    });
    return link.originalUrl;
  },
};
