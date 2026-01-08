import { unstable_cache as cache, revalidateTag } from 'next/cache';

// Cache tags for different types of data
export const CACHE_TAGS = {
  PROJECTS: 'projects',
  PERSONAL_DATA: 'personal-data',
  CONTACT: 'contact',
  OG_IMAGES: 'og-images',
} as const;

// Cached function to get personal data
export async function getCachedPersonalData() {
  try {
    // Direct import instead of dynamic import
    const { personalData } = await import('@/lib/personal-data');
    console.log('Cache: personalData imported successfully:', personalData?.name);
    return personalData;
  } catch (error) {
    console.error('Error loading personal data:', error);
    // Return a minimal fallback
    return {
      name: 'Themistoklis Baltzakis',
      title: 'ML/LLM Engineer',
      bio: 'ML/LLM Engineer with over 15 years of experience in IT support, cloud solutions, and Cisco infrastructure management.',
      email: 'contact@baltzakis.com',
      skills: ['Machine Learning', 'Python', 'AWS'],
      experience: [],
      education: [],
      languages: [],
      projects: [],
      certifications: [],
      achievements: [],
    };
  }
}

// Cached function to get projects
export const getCachedProjects = cache(
  async () => {
    const personalData = await getCachedPersonalData();
    return personalData.projects || [];
  },
  ['projects'],
  {
    revalidate: 1800, // 30 minutes
    tags: [CACHE_TAGS.PROJECTS],
  }
);

// Function to revalidate project data (disabled - cache not used)
export async function revalidateProjects() {
  // No-op since cache is disabled
}

// Function to revalidate personal data (disabled - cache not used)
export async function revalidatePersonalData() {
  // No-op since cache is disabled
}

// Function to revalidate all cache (disabled - cache not used)
export async function revalidateAll() {
  // No-op since cache is disabled
}

// Cache configuration for different scenarios
export const CACHE_CONFIG = {
  // Static pages - long cache
  STATIC: {
    revalidate: 86400, // 24 hours
  },
  // Dynamic content - medium cache
  DYNAMIC: {
    revalidate: 3600, // 1 hour
  },
  // User-specific content - short cache
  USER_SPECIFIC: {
    revalidate: 300, // 5 minutes
  },
  // Real-time content - no cache
  REALTIME: {
    revalidate: 0,
  },
} as const;

// Helper function to create cache options
export function createCacheOptions(type: keyof typeof CACHE_CONFIG, additionalTags: string[] = []) {
  return {
    ...CACHE_CONFIG[type],
    tags: additionalTags,
  };
}
