'use client';

import { Suspense } from 'react';

import dynamic from 'next/dynamic';

import { personalData } from '@/lib/personal-data';

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

const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <LoadingSkeleton height="400px" color="blue" />,
  ssr: false,
});

export default function ProjectsPage() {
  const data = personalData;

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
          <Projects data={data} />
        </Suspense>
      </div>
    </div>
  );
}