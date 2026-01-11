import { MetadataRoute } from 'next';

import { personalData } from '@/lib/personal-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = personalData.website || 'https://baltzakisthemis.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Dynamic project pages
  const projectPages = (personalData.projects || [])
    .filter((project) => project.id) // Filter out projects without ids
    .map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: project.date ? new Date(project.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...staticPages, ...projectPages];
}
