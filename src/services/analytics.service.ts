import { clickRepository } from '../repositories/click.repository.js';
import { linkRepository } from '../repositories/link.repository.js';
import { AppError } from '../utils/app-error.js';
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const group = (items: any[], key: string, empty = 'Direct') =>
  Object.entries(
    items.reduce(
      (a, c) => {
        const v = c[key] || empty;
        a[v] = (a[v] || 0) + 1;
        return a;
      },
      {} as Record<string, number>,
    ),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => (b.count as number) - (a.count as number));
export const analyticsService = {
  async get(userId: string, id: string) {
    const link = await linkRepository.findOwned(id, userId);
    if (!link) throw new AppError(404, 'LINK_NOT_FOUND', 'Link not found');
    const now = new Date();
    const since = new Date(now);
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);
    const [clicks, totalClicks] = await Promise.all([
      clickRepository.findForAnalytics(id, since),
      clickRepository.countAll(id),
    ]);
    const today = startOfDay(now);
    const seven = new Date(today);
    seven.setDate(seven.getDate() - 6);
    const byDate = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      byDate.set(d.toISOString().slice(0, 10), 0);
    }
    clicks.forEach((c) => {
      const k = c.createdAt.toISOString().slice(0, 10);
      byDate.set(k, (byDate.get(k) || 0) + 1);
    });
    return {
      link: { id: link.id, shortCode: link.shortCode, originalUrl: link.originalUrl },
      totalClicks,
      clicksToday: clicks.filter((c) => c.createdAt >= today).length,
      clicksLast7Days: clicks.filter((c) => c.createdAt >= seven).length,
      clicksLast30Days: clicks.length,
      clicksByDate: [...byDate].map(([date, count]) => ({ date, count })),
      topReferrers: group(clicks, 'referrer').slice(0, 10),
      browsers: group(clicks, 'browser'),
      operatingSystems: group(clicks, 'operatingSystem'),
      devices: group(clicks, 'device'),
      recentClicks: clicks
        .slice(0, 20)
        .map(
          ({
            id,
            ipAddress,
            userAgent,
            createdAt,
            referrer,
            device,
            browser,
            operatingSystem,
          }) => ({
            id,
            ipAddress,
            userAgent,
            createdAt,
            referrer,
            device,
            browser,
            operatingSystem,
          }),
        ),
    };
  },
};
