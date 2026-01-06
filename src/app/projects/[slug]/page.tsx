import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Project: ${slug}`,
    description: `Details about project ${slug}`,
    openGraph: {
      title: `Project: ${slug}`,
      description: `Details about project ${slug}`,
    },
  };
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;

  // Simulate data fetching
  await new Promise(resolve => setTimeout(resolve, 100));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Project: {slug}</h1>
      <div className="mb-6">
        <p className="text-muted-foreground">
          This is a dynamically rendered page for project {slug}.
        </p>
        {search.tab && (
          <p className="mt-2 text-sm text-primary">
            Current tab: {search.tab}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Project Details</h2>
          <p>Dynamic metadata generation</p>
          <p>Server-side rendering</p>
          <p>Search params handling</p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Technical Features</h2>
          <p>App Router</p>
          <p>TypeScript</p>
          <p>Next.js 16</p>
        </div>
      </div>
    </div>
  );
}
