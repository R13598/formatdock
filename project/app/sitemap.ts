import type { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';

const siteUrl = 'https://formatdocks.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/tools',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/exams',
    '/calculators',
    '/documents',
    '/wallpapers',
  ];
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1.0 : route === '/tools' ? 0.9 : 0.6,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...toolEntries];
}
