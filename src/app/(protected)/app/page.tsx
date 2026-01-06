'use client';

import { Suspense, memo } from 'react';

import dynamic from 'next/dynamic';

import About from '@/components/About';
import Achievements from '@/components/Achievements';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import Languages from '@/components/Languages';
import { getPersonalDataServer } from '@/lib/personal-data';

const LoadingSkeleton = memo(function LoadingSkeleton({
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
});

const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <LoadingSkeleton height="400px" color="blue" />,
  ssr: false,
});

const ExperienceComponent = dynamic(() => import('@/components/Experience'), {
  loading: () => <LoadingSkeleton height="300px" color="green" />,
  ssr: false,
});

const CertificationsComponent = dynamic(() => import('@/components/Certifications'), {
  loading: () => <LoadingSkeleton height="250px" color="purple" />,
  ssr: false,
});

const SkillsComponent = dynamic(() => import('@/components/Skills'), {
  loading: () => <LoadingSkeleton height="350px" color="orange" />,
  ssr: false,
});

const HomePage = memo(function HomePage() {
  const data = getPersonalDataServer();

  return (
    <div className="min-h-screen">
      <Hero data={data} />
      <About data={data} />

      <Suspense fallback={<LoadingSkeleton height="350px" color="orange" />}>
        <SkillsComponent data={data} />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton height="300px" color="green" />}>
        <ExperienceComponent data={data} />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton height="400px" color="blue" />}>
        <Projects data={data} />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton height="250px" color="purple" />}>
        <CertificationsComponent data={data} />
      </Suspense>

      <Languages data={data} />
      <Achievements data={data} />
      <Contact data={data} />
    </div>
  );
});

export default HomePage;
