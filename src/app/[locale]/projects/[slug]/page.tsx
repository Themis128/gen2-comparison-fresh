import { notFound } from 'next/navigation';

import { personalData } from '@/lib/personal-data';
import ProjectDetail from '@/components/ProjectDetail';

// ISR: Revalidate every hour for dynamic content
export const revalidate = 3600;

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const projects = personalData.projects || [];

  return projects.map((project) => ({
    slug: project.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const projects = personalData.projects || [];
  const project = projects.find((p) => p.id === params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  // Generate JSON-LD structured data for the project
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    author: {
      '@type': 'Person',
      name: personalData.name,
      jobTitle: personalData.title,
      url: personalData.website,
    },
    dateCreated: project.date,
    keywords: project.technologies.join(', '),
    url: `${personalData.website}/projects/${project.id}`,
    ...(project.image && { image: project.image }),
    ...(project.github && { codeRepository: project.github }),
    ...(project.url && { sameAs: project.url }),
    about: {
      '@type': 'Thing',
      name: project.category || 'Software Development',
    },
    contributor: {
      '@type': 'Person',
      name: personalData.name,
    },
  };

  return {
    title: `${project.title} | Themistoklis Baltzakis`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      url: `${personalData.website}/projects/${project.id}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(project.title)}&description=${encodeURIComponent(project.description)}&type=article&author=${encodeURIComponent(personalData.name)}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
        ...(project.image ? [{ url: project.image, alt: project.title }] : []),
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(project.title)}&description=${encodeURIComponent(project.description)}&type=article&author=${encodeURIComponent(personalData.name)}`,
          alt: project.title,
        },
        ...(project.image ? [project.image] : []),
      ],
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = personalData.projects?.find((p) => p.id === params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
