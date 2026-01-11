import { Suspense } from 'react';

import Projects from '@/components/Projects';
import { personalData } from '@/lib/personal-data';

// ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata() {
  const projects = personalData.projects || [];

  // Generate JSON-LD structured data for the projects collection
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects | Themistoklis Baltzakis',
    description:
      'A showcase of innovative software development projects and technical implementations by Themistoklis Baltzakis',
    author: {
      '@type': 'Person',
      name: personalData.name,
      jobTitle: personalData.title,
      url: personalData.website,
    },
    url: `${personalData.website}/projects`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          url: `${personalData.website}/projects/${project.id}`,
          ...(project.image && { image: project.image }),
          ...(project.date && { dateCreated: project.date }),
          keywords: project.technologies.join(', '),
        },
      })),
    },
  };

  return {
    title: 'Projects | Themistoklis Baltzakis',
    description:
      'A showcase of my work, featuring innovative solutions and technical implementations across various technologies and domains.',
    keywords: [
      'projects',
      'portfolio',
      'software development',
      'web development',
      ...personalData.skills,
    ],
    openGraph: {
      title: 'Projects | Themistoklis Baltzakis',
      description:
        'A showcase of my work, featuring innovative solutions and technical implementations.',
      type: 'website',
      url: `${personalData.website}/projects`,
      images: [
        {
          url: `/api/og?title=Projects%20%7C%20${encodeURIComponent(personalData.name)}&description=A%20showcase%20of%20my%20work%2C%20featuring%20innovative%20solutions&type=website&author=${encodeURIComponent(personalData.name)}`,
          width: 1200,
          height: 630,
          alt: 'Projects | Themistoklis Baltzakis',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Projects | Themistoklis Baltzakis',
      description:
        'A showcase of my work, featuring innovative solutions and technical implementations.',
      images: [
        {
          url: `/api/og?title=Projects%20%7C%20${encodeURIComponent(personalData.name)}&description=A%20showcase%20of%20my%20work%2C%20featuring%20innovative%20solutions&type=website&author=${encodeURIComponent(personalData.name)}`,
          alt: 'Projects | Themistoklis Baltzakis',
        },
      ],
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

const LoadingSkeleton = function LoadingSkeleton({
  height = '400px',
  color = 'blue',
}: {
  height?: string;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500',
  };

  return (
    <div
      className={`min-h-[${height}] flex items-center justify-center`}
      style={{ minHeight: height }}
    >
      <div
        className={`h-10 w-10 animate-spin rounded-full border-b-2 ${colorClasses[color] || colorClasses.blue}`}
      />
    </div>
  );
};

export default async function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
            My
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            A showcase of my work, featuring innovative solutions and technical implementations
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton height="400px" color="blue" />}>
          <Projects data={personalData} />
        </Suspense>
      </div>
    </div>
  );
}
