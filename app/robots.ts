import { MetadataRoute } from 'next';

import { personalData } from '@/lib/personal-data';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = personalData.website;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
