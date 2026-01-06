export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Name skeleton */}
            <div className="mb-8 space-y-6">
              <div className="mx-auto h-16 max-w-md animate-pulse rounded-lg bg-muted/50 md:h-20" />
              <div className="mx-auto h-8 max-w-sm animate-pulse rounded-lg bg-muted/40" />
              <div className="mx-auto h-6 max-w-2xl animate-pulse rounded-lg bg-muted/30" />
            </div>

            {/* Button skeletons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="h-12 w-36 animate-pulse rounded-lg bg-blue-500/30" />
              <div className="h-12 w-36 animate-pulse rounded-lg bg-muted/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="container mx-auto space-y-8 px-6 py-16">
        <div className="h-64 animate-pulse rounded-2xl bg-muted/30" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted/20" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-40 animate-pulse rounded-xl bg-muted/25" />
          <div className="h-40 animate-pulse rounded-xl bg-muted/25" />
          <div className="h-40 animate-pulse rounded-xl bg-muted/25" />
        </div>
      </div>
    </div>
  );
}
