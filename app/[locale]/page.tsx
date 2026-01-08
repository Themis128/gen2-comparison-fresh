import dynamic from 'next/dynamic';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import { personalData } from '@/lib/personal-data';

// Dynamically import components that are below the fold for better performance
const Achievements = dynamic(() => import('@/components/Achievements'), {
  loading: () => <div className="h-32 animate-pulse rounded-lg bg-muted" />,
});
const Certifications = dynamic(() => import('@/components/Certifications'), {
  loading: () => <div className="h-32 animate-pulse rounded-lg bg-muted" />,
});
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="h-32 animate-pulse rounded-lg bg-muted" />,
});
const ContactMessagesManager = dynamic(
  () =>
    import('@/components/ContactMessages').then((mod) => ({ default: mod.ContactMessagesManager })),
  {
    loading: () => <div className="h-16 animate-pulse rounded bg-muted" />,
  }
);
const TodoManager = dynamic(
  () => import('@/components/TodoManager').then((mod) => ({ default: mod.TodoManager })),
  {
    loading: () => <div className="h-16 animate-pulse rounded bg-muted" />,
  }
);

// Generate metadata for SEO
export async function generateMetadata() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalData.name,
    jobTitle: personalData.title,
    description: personalData.bio,
    url: personalData.website,
    sameAs: [personalData.twitter, personalData.linkedin, personalData.github].filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      addressLocality: personalData.location,
    },
    email: personalData.email,
    telephone: personalData.phone,
    knowsAbout: personalData.skills,
    hasOccupation: {
      '@type': 'Occupation',
      name: personalData.title,
      skills: personalData.skills,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': personalData.website,
    },
  };

  return {
    title: `${personalData.name} | ${personalData.title}`,
    description: personalData.bio,
    keywords: ['portfolio', 'developer', 'software engineer', ...personalData.skills],
    authors: [{ name: personalData.name }],
    creator: personalData.name,
    publisher: personalData.name,
    openGraph: {
      title: `${personalData.name} | ${personalData.title}`,
      description: personalData.bio,
      type: 'profile',
      url: personalData.website,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${personalData.name} | ${personalData.title}`,
      description: personalData.bio,
      creator: personalData.twitter?.split('/').pop(),
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default async function HomePage() {
  console.log('HomePage: personalData loaded:', personalData?.name);

  return (
    <main className="min-h-screen">
      <Hero data={personalData} />
      <About data={personalData} />
      <Skills data={personalData} />
      <Projects data={personalData} />
      <Experience data={personalData} />
      <Certifications data={personalData} />
      <Achievements data={personalData} />
      <Contact data={personalData} />

      {/* Portfolio Management Tools */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Portfolio Management</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <ContactMessagesManager />
            <TodoManager />
          </div>
        </div>
      </section>
    </main>
  );
}
