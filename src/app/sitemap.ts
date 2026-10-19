import { MetadataRoute } from 'next';
import { servicesData, managedCarePrograms } from '@/data/servicesData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://farmcare360.com';

  const staticRoutes = [
    '',
    '/services',
    '/for-your-space',
    '/managed-care',
    '/gallery',
    '/testimonials',
    '/landowners',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const serviceRoutes = servicesData.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const managedRoutes = managedCarePrograms.map((m) => ({
    url: `${baseUrl}/managed-care/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...managedRoutes];
}
