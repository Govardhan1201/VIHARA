import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://vihara.vercel.app';
  const locales = ['en', 'hi', 'te'];
  const routes = ['', '/explore', '/story', '/food', '/crowd', '/converters', '/tips', '/guide', '/about', '/submit'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${base}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route === '/explore' ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
